export type RoleName = "SUPER_ADMIN" | "ADMIN" | "MANAGER" | "DEVELOPER";

export type AppUser = {
  id: number;
  email: string;
  name: string | null;
  role: RoleName;
  active: boolean;
  lastLoginAt: string | null;
};

export type UsersResponse = {
  users: AppUser[];
  total: number;
  page: number;
  pageSize: number;
};

export type SyncRun = {
  id: number;
  kind: string;
  status: string;
  installationId: number;
  repositoryId: number | null;
  repoFullName: string | null;
  commitsSeen: number;
  commitsInserted: number;
  startedAt: string | null;
  finishedAt: string | null;
  durationMs: number | null;
  sinceDate: string | null;
};

export type SyncRunsResponse = {
  runs: SyncRun[];
  total: number;
  page: number;
  pageSize: number;
};

export type Setting = { key: string; value: unknown };
export type SettingsResponse = { settings: Record<string, unknown> };

export type AuditLogEntry = {
  id: number;
  action: string;
  targetType: string | null;
  targetId: string | null;
  ip: string | null;
  metadata: unknown;
  actorEmail: string | null;
  createdAt: string;
};

export type AuditLogResponse = {
  logs: AuditLogEntry[];
  total: number;
  page: number;
  pageSize: number;
};
