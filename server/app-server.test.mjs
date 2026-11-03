import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAppServer } from "./app-server.mjs";

const listen = (server) => new Promise((resolve) => { server.listen(0, "127.0.0.1", () => { resolve(server.address().port); }); });

describe("app server", () => {
  let appUrl; let app; let upstream; let seen;

  beforeAll(async () => {
    const dist = mkdtempSync(join(tmpdir(), "gam-dist-"));
    mkdirSync(join(dist, "assets"));
    writeFileSync(join(dist, "index.html"), "<!doctype html><html><head><script>window.theme=1</script></head><body><div id=root></div></body></html>");
    writeFileSync(join(dist, "assets", "app-abc.js"), "console.log(1)");
    writeFileSync(join(dist, "favicon.svg"), "<svg/>");

    upstream = createServer((req, res) => {
      const chunks = [];
      req.on("data", (c) => chunks.push(c));
      req.on("end", () => {
        seen = { method: req.method, url: req.url, headers: req.headers, body: Buffer.concat(chunks).toString() };
        if (req.url.startsWith("/api/v1/auth/me")) {
          res.writeHead(200, { "content-type": "application/json", "set-cookie": ["gam_session=abc; HttpOnly; Path=/", "other=1; Path=/"] });
          res.end('{"ok":true}');
        } else if (req.url === "/api/v1/missing") { res.writeHead(404, { "content-type": "application/json" }); res.end('{"error":"nope"}'); }
        else { res.writeHead(200); res.end(seen.body); }
      });
    });
    const upstreamPort = await listen(upstream);
    app = createAppServer({ distDir: dist, apiOrigin: `http://127.0.0.1:${upstreamPort}`, proxyTimeoutMs: 2000 });
    appUrl = `http://127.0.0.1:${await listen(app)}`;
  });
  afterAll(() => { app.close(); upstream.close(); });

  it("serves the app shell with a CSP that allows only the inline theme script by hash", async () => {
    const res = await fetch(`${appUrl}/`);
    expect(res.status).toBe(200);
    const csp = res.headers.get("content-security-policy") ?? "";
    expect(csp).toMatch(/script-src 'self' 'sha256-[A-Za-z0-9+/=]+'/);
    expect(csp).not.toContain("'unsafe-eval'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(res.headers.get("x-content-type-options")).toBe("nosniff");
    expect(res.headers.get("cache-control")).toBe("no-cache");
  });

  it("falls back to the app shell for client-side routes but 404s missing files", async () => {
    expect((await fetch(`${appUrl}/developers/101?range=last7`)).status).toBe(200);
    expect(await (await fetch(`${appUrl}/repositories/3`)).text()).toContain('<div id=root>');
    expect((await fetch(`${appUrl}/assets/missing-1.js`)).status).toBe(404);
  });

  it("caches hashed assets forever and never caches the shell", async () => {
    const asset = await fetch(`${appUrl}/assets/app-abc.js`);
    expect(asset.headers.get("cache-control")).toContain("immutable");
    expect(asset.headers.get("content-type")).toContain("javascript");
    expect((await fetch(`${appUrl}/favicon.svg`)).headers.get("cache-control")).toBe("no-cache");
  });

  it("blocks path traversal", async () => {
    const res = await fetch(`${appUrl}/..%2f..%2fetc%2fpasswd`);
    expect(await res.text()).not.toContain("root:");
  });

  it("answers its own health check and rejects other methods on pages", async () => {
    expect(await (await fetch(`${appUrl}/healthz`)).json()).toEqual({ ok: true });
    expect((await fetch(`${appUrl}/overview`, { method: "POST" })).status).toBe(405);
  });

  it("forwards /api requests with cookies and the CSRF header, and returns every Set-Cookie", async () => {
    const res = await fetch(`${appUrl}/api/v1/auth/me?x=1`, { headers: { cookie: "gam_session=s1", "x-csrf-token": "tok" } });
    expect(res.status).toBe(200);
    expect(res.headers.getSetCookie()).toEqual(["gam_session=abc; HttpOnly; Path=/", "other=1; Path=/"]);
    expect(seen.url).toBe("/api/v1/auth/me?x=1");
    expect(seen.headers.cookie).toBe("gam_session=s1");
    expect(seen.headers["x-csrf-token"]).toBe("tok");
    expect(seen.headers["x-forwarded-proto"]).toBe("https");
    expect(seen.headers.host).not.toBe(new URL(appUrl).host);
  });

  it("forwards request bodies and passes API error statuses through", async () => {
    const res = await fetch(`${appUrl}/api/v1/teams`, { method: "POST", headers: { "content-type": "application/json" }, body: '{"name":"Backend"}' });
    expect(await res.text()).toBe('{"name":"Backend"}');
    expect(seen.method).toBe("POST");
    const missing = await fetch(`${appUrl}/api/v1/missing`);
    expect(missing.status).toBe(404);
    expect(missing.headers.get("cache-control")).toBe("no-store");
  });

  it("returns a clear 502 when the API is down", async () => {
    const dist = mkdtempSync(join(tmpdir(), "gam-dist2-"));
    writeFileSync(join(dist, "index.html"), "<html></html>");
    const broken = createAppServer({ distDir: dist, apiOrigin: "http://127.0.0.1:1", proxyTimeoutMs: 1000 });
    const url = `http://127.0.0.1:${await listen(broken)}`;
    const res = await fetch(`${url}/api/v1/auth/me`);
    expect(res.status).toBe(502);
    expect((await res.json()).error).toMatch(/unavailable/i);
    broken.close();
  });
});
