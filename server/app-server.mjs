import { createHash } from "node:crypto";
import { createReadStream, readFileSync } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, resolve, sep } from "node:path";
import { Readable } from "node:stream";

const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml", ".json": "application/json", ".map": "application/json", ".png": "image/png",
  ".ico": "image/x-icon", ".woff2": "font/woff2", ".txt": "text/plain; charset=utf-8", ".webmanifest": "application/manifest+json",
};

// Hop-by-hop and connection-specific headers must not be forwarded to the API.
const DROP_REQUEST_HEADERS = new Set(["host", "connection", "keep-alive", "transfer-encoding", "upgrade", "content-length"]);
const DROP_RESPONSE_HEADERS = new Set(["connection", "keep-alive", "transfer-encoding", "content-encoding", "content-length", "set-cookie"]);

/** The theme bootstrap in index.html is an inline script, so CSP allows exactly that script by hash and nothing else. */
function inlineScriptHashes(html) {
  return [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => `'sha256-${createHash("sha256").update(m[1] ?? "").digest("base64")}'`);
}

function securityHeaders(scriptHashes) {
  return {
    "content-security-policy": [
      "default-src 'self'", `script-src 'self' ${scriptHashes.join(" ")}`.trim(), "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https://avatars.githubusercontent.com", "font-src 'self'", "connect-src 'self'",
      "base-uri 'self'", "form-action 'self'", "frame-ancestors 'none'", "object-src 'none'",
    ].join("; "),
    "strict-transport-security": "max-age=15552000; includeSubDomains",
    "x-content-type-options": "nosniff",
    "referrer-policy": "strict-origin-when-cross-origin",
    "permissions-policy": "camera=(), microphone=(), geolocation=()",
  };
}

/**
 * Serves the built single-page app and forwards /api/* to the backend, so the browser sees one origin
 * (the session cookie then works without CORS or a shared parent domain).
 * @param {{ distDir: string, apiOrigin: string, proxyTimeoutMs?: number }} options
 */
export function createAppServer({ distDir, apiOrigin, proxyTimeoutMs = 30_000 }) {
  const root = resolve(distDir);
  const indexHtml = readFileSync(join(root, "index.html"));
  const headers = securityHeaders(inlineScriptHashes(indexHtml.toString("utf8")));
  const api = new URL(apiOrigin);

  async function proxy(req, res) {
    const target = new URL(req.url ?? "/", api);
    const outgoing = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (DROP_REQUEST_HEADERS.has(key) || value === undefined) continue;
      outgoing.set(key, Array.isArray(value) ? value.join(", ") : value);
    }
    outgoing.set("x-forwarded-for", [req.headers["x-forwarded-for"], req.socket.remoteAddress].filter(Boolean).join(", "));
    outgoing.set("x-forwarded-proto", req.headers["x-forwarded-proto"] ?? "https");
    const hasBody = req.method !== "GET" && req.method !== "HEAD";
    try {
      const upstream = await fetch(target, {
        method: req.method, headers: outgoing, redirect: "manual", signal: AbortSignal.timeout(proxyTimeoutMs),
        ...(hasBody ? { body: Readable.toWeb(req), duplex: "half" } : {}),
      });
      const responseHeaders = {};
      upstream.headers.forEach((value, key) => { if (!DROP_RESPONSE_HEADERS.has(key)) responseHeaders[key] = value; });
      const cookies = upstream.headers.getSetCookie();
      if (cookies.length > 0) responseHeaders["set-cookie"] = cookies;
      res.writeHead(upstream.status, { ...responseHeaders, "cache-control": "no-store" });
      if (req.method === "HEAD" || !upstream.body) { res.end(); return; }
      Readable.fromWeb(upstream.body).pipe(res);
    } catch {
      res.writeHead(502, { "content-type": "application/json", "cache-control": "no-store" });
      res.end(JSON.stringify({ error: "The API is unavailable, try again shortly" }));
    }
  }

  async function serveStatic(req, res) {
    const pathname = decodeURIComponent(new URL(req.url ?? "/", "http://local").pathname);
    const candidate = normalize(join(root, pathname));
    const inside = candidate === root || candidate.startsWith(root + sep);
    let filePath = null;
    if (inside) {
      const info = await stat(candidate).catch(() => null);
      if (info?.isFile()) filePath = candidate;
    }
    if (filePath === null) {
      // A missing asset is a real 404; any other path is a client-side route, so serve the app shell.
      if (extname(pathname) !== "") { res.writeHead(404, headers); res.end("Not found"); return; }
      res.writeHead(200, { ...headers, "content-type": TYPES[".html"], "cache-control": "no-cache" });
      res.end(req.method === "HEAD" ? undefined : indexHtml);
      return;
    }
    const ext = extname(filePath);
    const immutable = filePath.includes(`${sep}assets${sep}`);
    res.writeHead(200, {
      ...headers, "content-type": TYPES[ext] ?? "application/octet-stream",
      "cache-control": immutable ? "public, max-age=31536000, immutable" : "no-cache",
    });
    if (req.method === "HEAD") { res.end(); return; }
    createReadStream(filePath).pipe(res);
  }

  return createServer((req, res) => {
    const url = req.url ?? "/";
    if (url === "/healthz") { res.writeHead(200, { "content-type": "application/json" }); res.end('{"ok":true}'); return; }
    if (url === "/api" || url.startsWith("/api/")) { void proxy(req, res); return; }
    if (req.method !== "GET" && req.method !== "HEAD") { res.writeHead(405, { allow: "GET, HEAD" }); res.end(); return; }
    serveStatic(req, res).catch(() => { res.writeHead(500); res.end("Server error"); });
  });
}
