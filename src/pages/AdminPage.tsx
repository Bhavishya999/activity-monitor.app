import { useState } from "react";
import { Search, RefreshCw } from "lucide-react";
import {
  useAdminUsers,
  useUpdateUser,
  useSettings,
  useUpdateSetting,
  useAuditLog,
  useSyncRuns,
  useTriggerSync,
  useGitHubAccounts,
} from "../hooks/useAdmin";
import { PageHeader } from "../components/core/PageHeader";
import { Pagination } from "../components/core/Pagination";
import { ErrorState } from "../components/core/ErrorState";
import { EmptyState } from "../components/core/EmptyState";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Switch } from "../components/ui/switch";
import { Skeleton } from "../components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../components/ui/table";
import type { AppUser, RoleName } from "../lib/interfaces/admin";

const PAGE_SIZE = 25;
const ROLES: RoleName[] = ["DEVELOPER", "MANAGER", "ADMIN", "SUPER_ADMIN"];

// ── Users Tab ────────────────────────────────────────────────────
function UsersTab() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, error, refetch } = useAdminUsers({
    page, pageSize: PAGE_SIZE, ...(search ? { search } : {}),
  });
  const updateUser = useUpdateUser();

  return (
    <div className="space-y-4">
      {isError && <ErrorState error={error} onRetry={() => void refetch()} />}

      <Card>
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by email or name…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="h-8 pl-8 text-xs"
            />
          </div>
          {data && (
            <p className="ml-auto text-xs text-muted-foreground">{data.total.toLocaleString()} users</p>
          )}
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-center">Active</TableHead>
              <TableHead className="text-right">Last Login</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="mx-auto h-5 w-10" /></TableCell>
                    <TableCell><Skeleton className="ml-auto h-4 w-28" /></TableCell>
                  </TableRow>
                ))
              : (data?.users ?? []).length === 0
              ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-12">
                      <EmptyState title={search ? "No matching users" : "No users"} />
                    </TableCell>
                  </TableRow>
                )
              : (data?.users ?? []).map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    onRoleChange={(role) => updateUser.mutate({ id: user.id, data: { role } })}
                    onActiveChange={(active) => updateUser.mutate({ id: user.id, data: { active } })}
                    isUpdating={updateUser.isPending}
                  />
                ))}
          </TableBody>
        </Table>

        {data && data.total > PAGE_SIZE && (
          <div className="px-4 pb-4">
            <Pagination page={page} pageSize={PAGE_SIZE} total={data.total} onChange={setPage} />
          </div>
        )}
      </Card>
    </div>
  );
}

type UserRowProps = {
  user: AppUser;
  onRoleChange: (role: RoleName) => void;
  onActiveChange: (active: boolean) => void;
  isUpdating: boolean;
};

function UserRow({ user, onRoleChange, onActiveChange, isUpdating }: UserRowProps) {
  return (
    <TableRow>
      <TableCell>
        <p className="font-medium">{user.email}</p>
        {user.name && <p className="text-xs text-muted-foreground">{user.name}</p>}
      </TableCell>
      <TableCell>
        <select
          value={user.role}
          onChange={(e) => onRoleChange(e.target.value as RoleName)}
          disabled={isUpdating}
          className="h-7 rounded-md border border-border bg-background px-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
        >
          {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </TableCell>
      <TableCell className="text-center">
        <Switch
          checked={user.active}
          onCheckedChange={onActiveChange}
          disabled={isUpdating}
          aria-label={`Toggle active for ${user.email}`}
        />
      </TableCell>
      <TableCell className="text-right text-xs text-muted-foreground">
        {user.lastLoginAt
          ? new Date(user.lastLoginAt).toLocaleString("en-US", {
              month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
            })
          : "Never"}
      </TableCell>
    </TableRow>
  );
}

// ── Settings Tab ─────────────────────────────────────────────────
function SettingsTab() {
  const { data, isLoading, isError, error, refetch } = useSettings();
  const updateSetting = useUpdateSetting();

  if (isError) return <ErrorState error={error} onRetry={() => void refetch()} />;

  const settings = data?.settings ?? {};

  return (
    <Card className="divide-y divide-border overflow-hidden">
      {isLoading
        ? Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-4">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-6 w-16" />
            </div>
          ))
        : Object.entries(settings).length === 0
        ? (
            <div className="px-5 py-8">
              <EmptyState title="No settings available" />
            </div>
          )
        : Object.entries(settings).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between px-5 py-4">
              <p className="text-sm font-medium">{key}</p>
              {typeof value === "boolean" ? (
                <Switch
                  checked={value}
                  onCheckedChange={(v) => updateSetting.mutate({ key, value: v })}
                  disabled={updateSetting.isPending}
                  aria-label={key}
                />
              ) : (
                <span className="rounded-md bg-muted px-2.5 py-1 font-mono text-xs">
                  {String(value)}
                </span>
              )}
            </div>
          ))}
    </Card>
  );
}

// ── Sync Runs Tab ────────────────────────────────────────────────
function SyncRunsTab() {
  const [page, setPage] = useState(1);
  const { data: accounts } = useGitHubAccounts();
  const { data, isLoading, isError, error, refetch } = useSyncRuns({ page, pageSize: PAGE_SIZE });
  const triggerSync = useTriggerSync();

  const firstAccountId = accounts?.accounts[0]?.installationId;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        {firstAccountId !== undefined && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => triggerSync.mutate(firstAccountId)}
            disabled={triggerSync.isPending}
            className="gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${triggerSync.isPending ? "animate-spin" : ""}`} />
            Trigger sync
          </Button>
        )}
      </div>

      {isError && <ErrorState error={error} onRetry={() => void refetch()} />}

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kind</TableHead>
              <TableHead>Repository</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Commits</TableHead>
              <TableHead className="text-right">Duration</TableHead>
              <TableHead className="text-right">Started</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((__, j) => (
                      <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                    ))}
                  </TableRow>
                ))
              : (data?.runs ?? []).length === 0
              ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-12">
                      <EmptyState title="No sync runs yet" />
                    </TableCell>
                  </TableRow>
                )
              : (data?.runs ?? []).map((run) => (
                  <TableRow key={run.id}>
                    <TableCell><Badge variant="outline">{run.kind}</Badge></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{run.repoFullName ?? "—"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          run.status === "completed" ? "success"
                          : run.status === "failed" ? "danger"
                          : "warning"
                        }
                      >
                        {run.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-xs text-muted-foreground">
                      +{run.commitsInserted} / {run.commitsSeen}
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">
                      {run.durationMs !== null ? `${(run.durationMs / 1000).toFixed(1)}s` : "—"}
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">
                      {run.startedAt
                        ? new Date(run.startedAt).toLocaleString("en-US", {
                            month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                          })
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
        {data && data.total > PAGE_SIZE && (
          <div className="px-4 pb-4">
            <Pagination page={page} pageSize={PAGE_SIZE} total={data.total} onChange={setPage} />
          </div>
        )}
      </Card>
    </div>
  );
}

// ── Audit Log Tab ────────────────────────────────────────────────
function AuditLogTab() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, refetch } = useAuditLog({ page, pageSize: PAGE_SIZE });

  return (
    <div className="space-y-4">
      {isError && <ErrorState error={error} onRetry={() => void refetch()} />}

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>IP</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 5 }).map((__, j) => (
                      <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                    ))}
                  </TableRow>
                ))
              : (data?.logs ?? []).length === 0
              ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-12">
                      <EmptyState title="No audit log entries" />
                    </TableCell>
                  </TableRow>
                )
              : (data?.logs ?? []).map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(log.createdAt).toLocaleString("en-US", {
                        month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell className="text-xs">{log.actorEmail ?? "system"}</TableCell>
                    <TableCell><Badge variant="outline">{log.action}</Badge></TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {log.targetType && log.targetId ? `${log.targetType}#${log.targetId}` : "—"}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{log.ip ?? "—"}</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
        {data && data.total > PAGE_SIZE && (
          <div className="px-4 pb-4">
            <Pagination page={page} pageSize={PAGE_SIZE} total={data.total} onChange={setPage} />
          </div>
        )}
      </Card>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────
export function AdminPage() {
  return (
    <div className="space-y-5 p-6">
      <PageHeader title="Administration" subtitle="Manage users, settings, sync and audit events" />

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="sync">Sync Runs</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <TabsContent value="users"><UsersTab /></TabsContent>
          <TabsContent value="settings"><SettingsTab /></TabsContent>
          <TabsContent value="sync"><SyncRunsTab /></TabsContent>
          <TabsContent value="audit"><AuditLogTab /></TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
