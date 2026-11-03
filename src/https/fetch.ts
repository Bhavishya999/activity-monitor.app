import { getCsrfToken } from "../lib/authSession";

type ApiError = { error: string; requestId?: string };

export class ApiException extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly requestId?: string,
  ) {
    super(message);
    this.name = "ApiException";
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const csrfToken = getCsrfToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string> | undefined),
  };

  if (csrfToken) {
    headers["x-csrf-token"] = csrfToken;
  }

  const apiBase = (import.meta.env["VITE_API_URL"] as string | undefined) ?? "";
  const res = await fetch(`${apiBase}/api/v1${path}`, {
    ...init,
    headers,
    credentials: "include",
  });

  if (res.status === 204) return undefined as T;

  // Lazily import to avoid a circular dependency at module-parse time.
  // handle401 imports queryClient which imports apiFetch, but since this import
  // is inside the function body it resolves after all modules are initialised.
  if (res.status === 401) {
    const { handle401 } = await import("../lib/queryClient");
    handle401();
    // Return a never-settling promise — the page is about to navigate away.
    return new Promise<T>(() => undefined);
  }

  const body = await res.json().catch(() => ({ error: `HTTP ${res.status}` })) as ApiError | T;

  if (!res.ok) {
    const err = body as ApiError;
    throw new ApiException(res.status, err.error ?? `HTTP ${res.status}`, err.requestId);
  }

  return body as T;
}
