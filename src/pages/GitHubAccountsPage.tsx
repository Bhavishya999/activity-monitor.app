import { memo } from "react";
import { RefreshCw } from "lucide-react";
import { useGitHubAccounts, useSyncRuns, useTriggerSync } from "../hooks/useAdmin";
import { PageHeader } from "../components/core/PageHeader";
import { ErrorState } from "../components/core/ErrorState";
import { EmptyState } from "../components/core/EmptyState";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import type { GitHubAccount } from "../lib/interfaces/github";

function statusVariant(
  status: GitHubAccount["status"],
): "success" | "warning" | "danger" {
  if (status === "active") return "success";
  if (status === "suspended") return "warning";
  return "danger";
}

const AccountCard = memo(function AccountCard({ account }: { account: GitHubAccount }) {
  const { data: runs } = useSyncRuns({ installationId: account.installationId, pageSize: 1 });
  const triggerSync = useTriggerSync();

  const lastRun = runs?.runs[0];

  return (
    <Card>
      <CardContent className="pt-5">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          {/* Identity */}
          <div className="flex items-center gap-3 sm:w-56 sm:shrink-0">
            <Avatar className="h-11 w-11 ring-2 ring-border">
              {account.account.avatarUrl && (
                <AvatarImage src={account.account.avatarUrl} alt={account.account.login} />
              )}
              <AvatarFallback>{account.account.login.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              {account.account.htmlUrl ? (
                <a
                  href={account.account.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block truncate font-semibold hover:underline"
                >
                  {account.account.login}
                </a>
              ) : (
                <p className="truncate font-semibold">{account.account.login}</p>
              )}
              <p className="text-xs text-muted-foreground">{account.account.type}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-1 flex-wrap gap-x-8 gap-y-3 text-sm">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Status</p>
              <Badge variant={statusVariant(account.status)} className="mt-1">
                {account.status}
              </Badge>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Repositories</p>
              <p className="mt-1 font-semibold tabular-nums">
                {account.activeRepoCount}
                <span className="font-normal text-muted-foreground"> / {account.repoCount} active</span>
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Selection</p>
              <p className="mt-1 font-semibold">{account.repositorySelection ?? "all"}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Last synced</p>
              <p className="mt-1 font-semibold">
                {account.lastSyncedAt
                  ? new Date(account.lastSyncedAt).toLocaleString("en-US", {
                      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                    })
                  : "Never"}
              </p>
            </div>
            {lastRun && (
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Last run</p>
                <Badge
                  variant={
                    lastRun.status === "completed" ? "success"
                    : lastRun.status === "failed" ? "danger"
                    : "warning"
                  }
                  className="mt-1"
                >
                  {lastRun.status}
                </Badge>
              </div>
            )}
          </div>

          {/* Action */}
          <div className="shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => triggerSync.mutate(account.installationId)}
              disabled={triggerSync.isPending}
              className="gap-1.5"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${triggerSync.isPending ? "animate-spin" : ""}`} />
              Sync now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

export function GitHubAccountsPage() {
  const { data, isLoading, isError, error, refetch } = useGitHubAccounts();

  return (
    <div className="space-y-5 p-6">
      <PageHeader
        title="GitHub Accounts"
        subtitle="GitHub App installations connected to this workspace"
      />

      {isError && <ErrorState error={error} onRetry={() => void refetch()} />}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-5">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-11 w-11 rounded-full" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (data?.accounts ?? []).length === 0 ? (
        <EmptyState
          title="No GitHub accounts connected"
          description="Install the GitHub App on your organization to start syncing commits."
        />
      ) : (
        <div className="space-y-3">
          {(data?.accounts ?? []).map((account) => (
            <AccountCard key={account.installationId} account={account} />
          ))}
        </div>
      )}
    </div>
  );
}
