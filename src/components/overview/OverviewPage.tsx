import { Building2, FolderGit2, GitCommitHorizontal, RefreshCw, Users } from "lucide-react";
import type { ReactElement } from "react";
import { Link } from "@tanstack/react-router";
import { ActivityCalendar } from "@/components/charts/ActivityCalendar";
import { ChartCard } from "@/components/charts/ChartCard";
import { HourlyChart } from "@/components/charts/HourlyChart";
import { RankedBars, type RankedItem } from "@/components/charts/RankedBars";
import { TrendChart } from "@/components/charts/TrendChart";
import { CommitList } from "@/components/commits/CommitList";
import { EmptyState } from "@/components/core/EmptyState";
import { ErrorState } from "@/components/core/ErrorState";
import { FilterBar } from "@/components/core/FilterBar";
import { PageHeader } from "@/components/core/PageHeader";
import { StatTile } from "@/components/core/StatTile";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFilters } from "@/hooks/useFilters";
import { useAnalyticsMeta } from "@/hooks/useAnalyticsMeta";
import { useOverview } from "@/hooks/useAnalytics";
import { formatNumber, formatRelative } from "@/lib/format";

export default function OverviewPage(): ReactElement {
  const { search } = useFilters();
  const { timezone } = useAnalyticsMeta();
  const { data, isLoading, isError, error, refetch } = useOverview(search);

  const leaders: RankedItem[] = (data?.leaderboard ?? []).map((l, i) => ({
    key: l.developer?.id ?? `unassigned-${i}`,
    label: l.developer?.login ?? "Unassigned",
    value: l.commits,
    muted: l.developer === null,
    note: l.developer === null ? "not matched to a GitHub account" : `${l.repositories} ${l.repositories === 1 ? "repo" : "repos"}`,
    leading: <Avatar login={l.developer?.login ?? "??"} src={l.developer?.avatarUrl} size="sm" />,
    ...(l.developer ? { wrap: (row: ReactElement) => { const id = String(l.developer?.id); return <Link to="/developers/$developerId" params={{ developerId: id }} search={search} className="-mx-2 block rounded-lg px-2 py-1 hover:bg-surface-2">{row}</Link>; } } : {}),
  }));
  const repos: RankedItem[] = (data?.repositoryDistribution ?? []).map((r) => ({
    key: r.id, label: r.name, value: r.commits,
    wrap: (row: ReactElement) => <Link to="/repositories/$repositoryId" params={{ repositoryId: String(r.id) }} search={search} className="-mx-2 block rounded-lg px-2 py-1 hover:bg-surface-2">{row}</Link>,
  }));

  return (
    <>
      <PageHeader title="Overview" description="Engineering activity across every connected GitHub organization" />
      <FilterBar />
      {isError ? <ErrorState error={error} onRetry={() => { void refetch(); }} /> : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatTile label="Total commits" value={data?.totals.commits} icon={GitCommitHorizontal} isLoading={isLoading} hint={data ? `${formatNumber(data.totals.mergeCommits)} merge commits` : undefined} />
            <StatTile label="Active developers" value={data?.totals.activeDevelopers} icon={Users} isLoading={isLoading} hint={data && data.totals.unassignedCommits > 0 ? `${formatNumber(data.totals.unassignedCommits)} commits unassigned` : "in this period"} />
            <StatTile label="Active repositories" value={data?.totals.activeRepositories} icon={FolderGit2} isLoading={isLoading} hint={data ? `of ${formatNumber(data.totals.connectedRepositories)} connected` : undefined} />
            <StatTile label="GitHub organizations" value={data?.totals.connectedInstallations} icon={Building2} isLoading={isLoading} hint="connected installations" />
          </div>

          {!isLoading && data && data.totals.commits === 0 ? (
            <EmptyState icon={GitCommitHorizontal} title="No commits in this period" description="Try a wider date range, or check that the GitHub App is installed and the first import has finished (see Synchronization)." />
          ) : (
            <>
              <div className="grid gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2"><TrendChart data={data?.dailyTrend ?? []} isLoading={isLoading} /></div>
                <HourlyChart data={data?.hourlyActivity ?? []} isLoading={isLoading} timezone={timezone} />
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                <ChartCard title="Top contributors" description="Commits by author. Counts show activity, not productivity." isLoading={isLoading} height={300}
                  table={{ columns: [{ key: "who", header: "Developer" }, { key: "commits", header: "Commits", align: "right" }], rows: leaders.map((l) => ({ who: l.label, commits: l.value })) }}>
                  <RankedBars items={leaders} emptyLabel="No attributed commits yet" />
                </ChartCard>
                <ChartCard title="Repository activity" description="Where the commits landed" isLoading={isLoading} height={300}
                  table={{ columns: [{ key: "repo", header: "Repository" }, { key: "commits", header: "Commits", align: "right" }], rows: repos.map((r) => ({ repo: r.label, commits: r.value })) }}>
                  <RankedBars items={repos} emptyLabel="No repository activity" />
                </ChartCard>
              </div>
              <ActivityCalendar data={data?.dailyTrend ?? []} isLoading={isLoading} />
              <div className="grid gap-4 lg:grid-cols-3">
                <Card className="rise lg:col-span-2">
                  <CardHeader>
                    <div><CardTitle>Recent commits</CardTitle><CardDescription>Newest first, refreshed automatically</CardDescription></div>
                    <Link to="/commits" search={search} className="text-xs font-medium text-accent-strong hover:underline">View all</Link>
                  </CardHeader>
                  <CardContent>{isLoading ? <Skeleton className="h-64 w-full" /> : <CommitList commits={data?.recentCommits ?? []} timezone={timezone} />}</CardContent>
                </Card>
                <Card className="rise self-start">
                  <CardHeader><div><CardTitle>Synchronization</CardTitle><CardDescription>Data follows GitHub through webhooks</CardDescription></div></CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <span className="rounded-lg bg-accent-soft p-2 text-accent-strong"><RefreshCw aria-hidden className="size-4" /></span>
                      <div><div className="text-sm font-medium text-fg">{data?.lastSyncedAt ? `Last synced ${formatRelative(data.lastSyncedAt)}` : "No sync recorded yet"}</div>
                        <div className="text-xs text-faint">{formatNumber(data?.totals.connectedRepositories ?? 0)} repositories monitored</div></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
