import { useState, useCallback } from "react";
import { GitCommitHorizontal, Users, FolderGit2, GitBranch, RefreshCw } from "lucide-react";
import { useOverview } from "../hooks/useAnalytics";
import { useGitHubAccounts } from "../hooks/useAdmin";
import { FilterBar, type FilterValues } from "../components/core/FilterBar";
import { PageHeader } from "../components/core/PageHeader";
import { StatCard } from "../components/core/StatCard";
import { ErrorState } from "../components/core/ErrorState";
import { EmptyState } from "../components/core/EmptyState";
import { StatsSkeleton, ChartSkeleton, ContributorListSkeleton } from "../components/core/Skeletons";
import { CommitTrendChart } from "../components/charts/CommitTrendChart";
import { HourlyActivityChart } from "../components/charts/HourlyActivityChart";
import { TopListChart } from "../components/charts/TopListChart";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}
function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

const DEFAULT_FILTER: FilterValues = {
  dateFrom: daysAgo(29),
  dateTo: today(),
  includeMerges: false,
  includeBots: false,
};

export function OverviewPage() {
  const [filter, setFilter] = useState<FilterValues>(DEFAULT_FILTER);
  const { data, isLoading, isFetching, isError, error, refetch } = useOverview(filter);
  const { data: accounts } = useGitHubAccounts();

  const handleFilterChange = useCallback((next: FilterValues) => setFilter(next), []);

  const ghCount = accounts?.accounts.length ?? null;
  const isBackgroundFetching = isFetching && !isLoading;

  return (
    <div className="space-y-5 p-6">
      <PageHeader
        title="Overview"
        subtitle="Company-wide commit activity"
        actions={
          isBackgroundFetching ? (
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground" aria-live="polite">
              <RefreshCw className="h-3 w-3 animate-spin" aria-hidden />
              Refreshing…
            </span>
          ) : undefined
        }
      />

      {data?.sample && (
        <div className="rounded-lg border border-amber-400/30 bg-amber-400/8 px-4 py-2.5 text-[13px] font-medium text-amber-600 dark:text-amber-400">
          ⚠ SAMPLE DATA — not production commits
        </div>
      )}

      <FilterBar value={filter} onChange={handleFilterChange} />

      {isError && <ErrorState error={error} onRetry={() => void refetch()} />}

      {/* Stat cards — skeleton on initial load only */}
      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Commits" value={data?.totalCommits} icon={GitCommitHorizontal} />
          <StatCard label="Active Developers" value={data?.totalDevelopers} icon={Users} />
          <StatCard label="Repositories" value={data?.totalRepos} icon={FolderGit2} />
          <StatCard label="GitHub Accounts" value={ghCount} icon={GitBranch} />
        </div>
      )}

      {/* Commit trend */}
      <Card>
        <CardHeader>
          <CardTitle>Commit Trend</CardTitle>
          {data && (
            <p className="text-[11px] text-muted-foreground">
              {data.dateRange.from} → {data.dateRange.to}
            </p>
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? <ChartSkeleton height={208} /> : <CommitTrendChart data={data?.commitTrend ?? []} />}
        </CardContent>
      </Card>

      {/* Two-col row */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Hourly Activity</CardTitle></CardHeader>
          <CardContent>
            {isLoading ? <ChartSkeleton height={176} /> : <HourlyActivityChart data={data?.hourlyActivity ?? []} />}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Top Repositories</CardTitle></CardHeader>
          <CardContent>
            {isLoading ? (
              <ChartSkeleton height={176} />
            ) : (data?.topRepos.length ?? 0) === 0 ? (
              <EmptyState title="No repos with commits" />
            ) : (
              <TopListChart
                data={(data?.topRepos ?? []).map((r) => ({ label: r.fullName, count: r.count }))}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top contributors */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Top Contributors</CardTitle>
            <span className="text-[10px] text-muted-foreground">commit count ≠ productivity</span>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <ContributorListSkeleton rows={5} />
          ) : (data?.topContributors.length ?? 0) === 0 ? (
            <EmptyState title="No contributors in this period" />
          ) : (
            <ol className="divide-y divide-border">
              {(data?.topContributors ?? []).map((c, i) => (
                <li key={c.id} className="flex items-center gap-3 py-2.5">
                  <span className="w-5 shrink-0 text-right text-xs tabular-nums text-muted-foreground">{i + 1}</span>
                  <Avatar className="h-7 w-7">
                    {c.avatarUrl && <AvatarImage src={c.avatarUrl} alt={c.login} />}
                    <AvatarFallback>{c.login.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="flex-1 truncate text-[13px] font-medium">{c.login}</span>
                  <span className="shrink-0 text-[13px] tabular-nums text-muted-foreground">
                    {c.count.toLocaleString()}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
