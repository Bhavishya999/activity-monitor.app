import { useState } from "react";
import { useParams, Link } from "@tanstack/react-router";
import { ArrowLeft, GitCommitHorizontal, Calendar } from "lucide-react";
import { useDeveloperDetail } from "../hooks/useAnalytics";
import { FilterBar, type FilterValues } from "../components/core/FilterBar";
import { PageHeader } from "../components/core/PageHeader";
import { StatCard } from "../components/core/StatCard";
import { ErrorState } from "../components/core/ErrorState";
import { CommitTrendChart } from "../components/charts/CommitTrendChart";
import { HourlyActivityChart } from "../components/charts/HourlyActivityChart";
import { TopListChart } from "../components/charts/TopListChart";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";

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

export function DeveloperDetailPage() {
  const { id } = useParams({ from: "/developers/$id" });
  const developerId = parseInt(id, 10);

  const [filter, setFilter] = useState<FilterValues>(DEFAULT_FILTER);
  const { data, isLoading, isError, error, refetch } = useDeveloperDetail(developerId, filter);

  const dev = data?.developer;

  return (
    <div className="space-y-5 p-6">
      <Link
        to="/developers"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Developers
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4">
        {isLoading ? (
          <>
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3.5 w-24" />
            </div>
          </>
        ) : dev ? (
          <>
            <Avatar className="h-12 w-12 ring-2 ring-border">
              {dev.avatarUrl && <AvatarImage src={dev.avatarUrl} alt={dev.login} />}
              <AvatarFallback>{dev.login.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <PageHeader title={dev.login} subtitle={`Account type: ${dev.type}`} />
          </>
        ) : null}
      </div>

      {isError && <ErrorState error={error} onRetry={() => void refetch()} />}

      <FilterBar value={filter} onChange={setFilter} />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          label="Commits in period"
          value={data?.commitCount}
          icon={GitCommitHorizontal}
          loading={isLoading}
        />
        <StatCard
          label="Last active"
          value={
            data?.lastCommittedAt
              ? new Date(data.lastCommittedAt).toLocaleDateString("en-US", {
                  month: "long", day: "numeric", year: "numeric",
                })
              : "—"
          }
          icon={Calendar}
          loading={isLoading}
        />
      </div>

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
          {isLoading ? <Skeleton className="h-52 w-full" /> : <CommitTrendChart data={data?.commitTrend ?? []} />}
        </CardContent>
      </Card>

      {/* Bottom grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Repository Breakdown</CardTitle></CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-44 w-full" />
            ) : (
              <TopListChart
                data={(data?.repoBreakdown ?? []).map((r) => ({ label: r.fullName, count: r.count }))}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Hourly Activity</CardTitle></CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-44 w-full" /> : <HourlyActivityChart data={data?.hourlyActivity ?? []} />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
