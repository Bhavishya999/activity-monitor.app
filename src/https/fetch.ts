import { z } from "zod";
import { getCsrfToken } from "@/lib/authSession";
import { API_BASE, API_PREFIX, CSRF_HEADER } from "@/lib/constants/app-constants";
import { ApiError } from "./httpErrorHandler";

const vErrorBody = z.object({ error: z.string(), requestId: z.string().optional() });

type Method = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
type Options = { method?: Method; query?: URLSearchParams; body?: unknown; signal?: AbortSignal | undefined };

/** Single entry point for API calls: cookies included, CSRF header on writes, typed errors with the request id. */
export async function apiFetch<T>(path: string, options: Options = {}): Promise<T> {
  const method = options.method ?? "GET";
  const query = options.query && options.query.size > 0 ? `?${options.query.toString()}` : "";
  const headers: Record<string, string> = {};
  if (options.body !== undefined) headers["content-type"] = "application/json";
  const csrf = getCsrfToken();
  if (method !== "GET" && csrf) headers[CSRF_HEADER] = csrf;

  const response = await fetch(`${API_BASE}${API_PREFIX}${path}${query}`, {
    method, headers, credentials: "include", signal: options.signal ?? null,
    body: options.body === undefined ? null : JSON.stringify(options.body),
  });

  if (!response.ok) {
    const parsed = vErrorBody.safeParse(await response.json().catch(() => null));
    throw new ApiError(response.status, parsed.success ? parsed.data.error : `Request failed (${response.status})`, parsed.success ? (parsed.data.requestId ?? null) : null);
  }
  // Responses are shaped by our own API (typed in lib/interfaces); a shape drift surfaces in the UI states and tests.
  return (await response.json()) as T;
}
