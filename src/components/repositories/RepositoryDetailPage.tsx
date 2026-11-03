import { ArrowLeft, GitBranch, GitCommitHorizontal, Users } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { ReactElement } from "react";
import { ActivityCalendar } from "@/components/charts/ActivityCalendar";
import { ChartCard } from "@/components/charts/ChartCard";
import { HourlyChart } from "@/components/charts/HourlyChart";
import { RankedBars } from "@/components/charts/RankedBars";
import { TrendChart } from "@/components/charts/TrendChart";
import { CommitList } from "@/components/commits/CommitList";
import { ErrorState } from "@/components/core/ErrorState";
import { FilterBar } from "@/components/core/FilterBar";
import { PageHeader } from "@/components/core/PageHeader";
import { StatTile } from "@/components/core/StatTile";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnalyticsMeta } from "@/hooks/useAnalyticsMeta";
import { useFilters } from "@/hooks/useFilters";
import { useRepository } from "@/hooks/useRepositories";
import { formatNumber, formatRelative } from "@/lib/format";

export default function RepositoryDetailPage({ repositoryId }: { repositoryId: number }): ReactElement {
  const { search } = useFilters();
  const { timezone } = useAnalyticsMeta();
  const { data, isLoading, isError, error, refetch } = useRepository(repositoryId, search);
  const back = <Link to="/repositories" search={search} className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg"><ArrowLeft aria-hidden className="size-4" />All repositories</Link>;

  if (isError) return <>{back}<ErrorState error={error} onRetry={() => { void refetch(); }} /></>;
  const repo = data?.repository;
  const deletedBranches = data?.branches.filter((b) => b.isDeleted).length ?? 0;

  return (
    <>
      {back}
      <PageHeader title={repo?.name ?? "Repository"} description={repo ? `${repo.account}${repo.isPrivate ? " · private" : ""}${repo.lastSyncedAt ? ` · synced ${formatRelative(repo.lastSyncedAt)}` : ""}` : undefined} />
      <FilterBar showTeam={false} showOrganization={false} />
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatTile label="Commits" value={repo?.commits} icon={GitCommitHorizontal} isLoading={isLoading} hint="in this period" />
          <StatTile label="Contributors" value={repo?.contributors} icon={Users} isLoading={isLoading} />
          <StatTile label="Branches" value={data?.branches.length} icon={GitBranch} isLoading={isLoading} hint={deletedBranches > 0 ? `${deletedBranches} deleted on GitHub` : undefined} />
          <StatTile label="Last commit" value={repo?.latestCommitAt ? formatRelative(repo.latestCommitAt) : undefined} icon={GitCommitHorizontal} isLoading={isLoading} hint="in this period" />
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2"><TrendChart data={data?.dailyTrend ?? []} isLoading={isLoading} /></div>
          <HourlyChart data={data?.hourlyActivity ?? []} isLoading={isLoading} timezone={timezone} />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard title="Contributors" description="Commits by author in this repository" isLoading={isLoading} height={260}
            table={{ columns: [{ key: "who", header: "Developer" }, { key: "commits", header: "Commits", align: "right" }], rows: (data?.contributors ?? []).map((c) => ({ who: c.developer?.login ?? "Unassigned", commits: c.commits })) }}>
            <RankedBars emptyLabel="No contributors in this period" items={(data?.contributors ?? []).map((c, i) => ({
              key: c.developer?.id ?? `u${i}`, label: c.developer?.login ?? "Unassigned", value: c.commits, muted: c.developer === null,
              leading: <Avatar login={c.developer?.login ?? "??"} src={c.developer?.avatarUrl} size="sm" />,
              ...(c.developer ? { wrap: (row: ReactElement) => <Link to="/developers/$developerId" params={{ developerId: String(c.developer?.id) }} search={search} className="-mx-2 block rounded-lg px-2 py-1 hover:bg-surface-2">{row}</Link> } : {}),
            }))} />
          </ChartCard>
          <Card className="rise">
            <CardHeader><div><CardTitle>Branches</CardTitle><CardDescription>Commits are counted once even when they appear on several branches</CardDescription></div></CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-56 w-full" /> : (
                <ul className="divide-y divide-border">
                  {data?.branches.map((b) => (
                    <li key={b.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                      <span className="flex min-w-0 items-center gap-2"><GitBranch aria-hidden className="size-3.5 text-faint" /><span className="truncate font-mono text-xs">{b.name}</span>
                        {b.isDefault ? <Badge tone="accent">default</Badge> : null}{b.isDeleted ? <Badge tone="warning">deleted</Badge> : null}</span>
                      <span className="tabular text-muted">{formatNumber(b.commits)} commits</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
        <ActivityCalendar data={data?.dailyTrend ?? []} isLoading={isLoading} />
        <Card className="rise">
          <CardHeader><div><CardTitle>Recent commits</CardTitle><CardDescription>Latest activity in this repository</CardDescription></div></CardHeader>
          <CardContent>{isLoading ? <Skeleton className="h-56 w-full" /> : <CommitList commits={data?.recentCommits ?? []} timezone={timezone} showRepository={false} />}</CardContent>
        </Card>
      </div>
    </>
  );
}
