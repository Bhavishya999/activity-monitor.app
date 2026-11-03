import { apiFetch } from "../fetch";
import type { AuditLogResponse, RoleName, SettingsResponse, SyncRunsResponse, UsersResponse } from "../../lib/interfaces/admin";

export async function fetchUsers(params: {
  page?: number;
  pageSize?: number;
  search?: string;
}): Promise<UsersResponse> {
  const q = new URLSearchParams();
  if (params.page) q.set("page", String(params.page));
  if (params.pageSize) q.set("pageSize", String(params.pageSize));
  if (params.search) q.set("search", params.search);
  const qs = q.toString() ? `?${q.toString()}` : "";
  return apiFetch<UsersResponse>(`/admin/users${qs}`);
}

export async function updateUser(
  id: number,
  data: { role?: RoleName; active?: boolean },
): Promise<void> {
  await apiFetch<unknown>(`/admin/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function fetchSettings(): Promise<SettingsResponse> {
  return apiFetch<SettingsResponse>("/admin/settings");
}

export async function updateSetting(key: string, value: unknown): Promise<void> {
  await apiFetch<unknown>("/admin/settings", {
    method: "PUT",
    body: JSON.stringify({ key, value }),
  });
}

export async function fetchSyncRuns(params: {
  page?: number;
  pageSize?: number;
  installationId?: number;
}): Promise<SyncRunsResponse> {
  const q = new URLSearchParams();
  if (params.page) q.set("page", String(params.page));
  if (params.pageSize) q.set("pageSize", String(params.pageSize));
  if (params.installationId) q.set("installationId", String(params.installationId));
  const qs = q.toString() ? `?${q.toString()}` : "";
  return apiFetch<SyncRunsResponse>(`/sync/runs${qs}`);
}

export async function triggerSync(installationId: number): Promise<void> {
  await apiFetch<unknown>("/sync/trigger", {
    method: "POST",
    body: JSON.stringify({ installationId }),
  });
}

export async function fetchAuditLog(params: { page?: number; pageSize?: number }): Promise<AuditLogResponse> {
  const q = new URLSearchParams();
  if (params.page) q.set("page", String(params.page));
  if (params.pageSize) q.set("pageSize", String(params.pageSize));
  const qs = q.toString() ? `?${q.toString()}` : "";
  return apiFetch<AuditLogResponse>(`/admin/audit${qs}`);
}
