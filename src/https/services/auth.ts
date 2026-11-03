import type { AppMeta, MeResponse, Role } from "@/lib/interfaces/auth";
import { apiFetch } from "../fetch";

export const fetchMe = (signal?: AbortSignal): Promise<MeResponse> => apiFetch<MeResponse>("/auth/me", { signal });
export const fetchMeta = (signal?: AbortSignal): Promise<AppMeta> => apiFetch<AppMeta>("/meta", { signal });

export const devLogin = (email: string, role: Role): Promise<{ csrfToken: string }> =>
  apiFetch<{ csrfToken: string }>("/auth/dev-login", { method: "POST", body: { email, role } });

export const logout = (): Promise<{ ok: boolean }> => apiFetch<{ ok: boolean }>("/auth/logout", { method: "POST" });
