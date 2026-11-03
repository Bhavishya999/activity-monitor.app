import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setCsrfToken } from "@/lib/authSession";
import { apiFetch } from "./fetch";
import { ApiError } from "./httpErrorHandler";

const json = (body: unknown, status = 200): Response => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

describe("apiFetch", () => {
  const fetchMock = vi.fn<typeof fetch>();
  beforeEach(() => { vi.stubGlobal("fetch", fetchMock); setCsrfToken("csrf-abc"); });
  afterEach(() => { fetchMock.mockReset(); vi.unstubAllGlobals(); setCsrfToken(null); });

  it("sends cookies and builds the query string", async () => {
    fetchMock.mockImplementation(() => Promise.resolve(json({ ok: true })));
    await apiFetch("/analytics/overview", { query: new URLSearchParams({ range: "last7" }) });
    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(url).toBe("/api/v1/analytics/overview?range=last7");
    expect(init?.credentials).toBe("include");
  });

  it("adds the CSRF header to writes only", async () => {
    fetchMock.mockImplementation(() => Promise.resolve(json({ ok: true })));
    await apiFetch("/teams", { method: "POST", body: { name: "x" } });
    await apiFetch("/teams");
    expect(new Headers(fetchMock.mock.calls[0]?.[1]?.headers).get("x-csrf-token")).toBe("csrf-abc");
    expect(new Headers(fetchMock.mock.calls[1]?.[1]?.headers).get("x-csrf-token")).toBeNull();
  });

  it("turns API errors into ApiError with the request id", async () => {
    fetchMock.mockResolvedValue(json({ error: "Developer not found", requestId: "r-9" }, 404));
    const error = await apiFetch("/developers/1").catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 404, message: "Developer not found", requestId: "r-9" });
  });

  it("copes with non-JSON failures", async () => {
    fetchMock.mockResolvedValue(new Response("<html>bad gateway</html>", { status: 502 }));
    const error = await apiFetch("/x").catch((e: unknown) => e);
    expect(error).toMatchObject({ status: 502, message: "Request failed (502)" });
  });
});
