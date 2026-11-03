import { useState } from "react";
import { useParams, Link } from "@tanstack/react-router";
import { ArrowLeft, GitCommitHorizontal, ExternalLink, RefreshCw } from "lucide-react";
import { useRepositoryDetail } from "../hooks/useAnalytics";
import { FilterBar, type FilterValues } from "../components/core/FilterBar";
import { PageHeader } from "../components/core/PageHeader";
import { StatCard } from "../components/core/StatCard";
import { ErrorState } from "../components/core/ErrorState";
import { ProfileHeaderSkeleton, ChartSkeleton } from "../components/core/Skeletons";
import { CommitTrendChart } from "../components/charts/CommitTrendChart";
import { HourlyActivityChart } from "../components/charts/HourlyActivityChart";
import { TopListChart } from "../components/charts/TopListChart";
import { Badge } from "../components/ui/badge";
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

export function RepositoryDetailPage() {
  const { id } = useParams({ from: "/dashboard/repositories/$id" });
  const repoId = parseInt(id, 10);

  const [filter, setFilter] = useState<FilterValues>(DEFAULT_FILTER);
  const { data, isLoading, isFetching, isError, error, refetch } = useRepositoryDetail(repoId, filter);

  const repo = data?.repository;
  const isBackgroundFetching = isFetching && !isLoading;

  return (
    <div className="space-y-5 p-6">
      <Link
        to="/dashboard/repositories"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Repositories
      </Link>

      {/* Header */}
      {isLoading ? (
        <ProfileHeaderSkeleton />
      ) : repo ? (
        <div>
          <PageHeader
            title={repo.name}
            subtitle={repo.fullName}
            actions={
              isBackgroundFetching ? (
                <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground" aria-live="polite">
                  <RefreshCw className="h-3 w-3 animate-spin" aria-hidden />
                  Refreshing…
                </span>
              ) : repo.htmlUrl ? (
                <a
                  href={repo.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  View on GitHub <ExternalLink className="h-3 w-3" />
                </a>
              ) : undefined
            }
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {repo.private && <Badge variant="muted">Private</Badge>}
            {repo.archived && <Badge variant="warning">Archived</Badge>}
            {repo.defaultBranch && <Badge variant="outline">{repo.defaultBranch}</Badge>}
          </div>
        </div>
      ) : null}

      {isError && <ErrorState error={error} onRetry={() => void refetch()} />}

      <FilterBar value={filter} onChange={setFilter} />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Commits in period" value={data?.commitCount} icon={GitCommitHorizontal} loading={isLoading} />
        <StatCard
          label="Date range"
          value={data ? `${data.dateRange.from} → ${data.dateRange.to}` : undefined}
          icon={GitCommitHorizontal}
          loading={isLoading}
        />
      </div>

      {/* Commit trend */}
      <Card>
        <CardHeader><CardTitle>Commit Trend</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? <ChartSkeleton height={208} /> : <CommitTrendChart data={data?.commitTrend ?? []} />}
        </CardContent>
      </Card>

      {/* Bottom grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Top Contributors</CardTitle>
              <span className="text-[10px] text-muted-foreground">commit count ≠ productivity</span>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <ChartSkeleton height={176} />
            ) : (
              <TopListChart
                data={(data?.topContributors ?? []).map((c) => ({ label: c.login, count: c.count }))}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Hourly Activity</CardTitle></CardHeader>
          <CardContent>
            {isLoading ? <ChartSkeleton height={176} /> : <HourlyActivityChart data={data?.hourlyActivity ?? []} />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
