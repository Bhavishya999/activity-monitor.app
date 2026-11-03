import { ArrowLeft, ExternalLink, FolderGit2, GitCommitHorizontal, GitMerge, Link2 } from "lucide-react";
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
import { useDeveloper } from "@/hooks/useDevelopers";
import { useFilters } from "@/hooks/useFilters";
import { formatDate, formatNumber } from "@/lib/format";

export default function DeveloperDetailPage({ developerId }: { developerId: number }): ReactElement {
  const { search } = useFilters();
  const { timezone } = useAnalyticsMeta();
  const { data, isLoading, isError, error, refetch } = useDeveloper(developerId, search);

  if (isError) return <><BackLink /><ErrorState error={error} onRetry={() => { void refetch(); }} /></>;

  const dev = data?.developer;
  return (
    <>
      <BackLink />
      <PageHeader
        title={data?.employee?.name ?? dev?.login ?? "Developer"}
        description={dev ? (data?.employee ? `GitHub: ${dev.login}` : "Matched by GitHub account") : undefined}
        leading={dev ? <Avatar login={dev.login} src={dev.avatarUrl} size="lg" /> : <Skeleton className="size-14 rounded-full" />}
        actions={dev?.profileUrl ? <a href={dev.profileUrl} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-surface px-3 text-sm text-fg shadow-card hover:bg-surface-2">GitHub profile<ExternalLink aria-hidden className="size-3.5" /></a> : undefined}
      />
      {data && data.linkedAccounts.length > 1 ? (
        <div className="-mt-2 mb-4 flex flex-wrap items-center gap-2 text-xs text-muted">
          <Link2 aria-hidden className="size-3.5" />Linked GitHub accounts:
          {data.linkedAccounts.map((a) => <Link key={a.id} to="/developers/$developerId" params={{ developerId: String(a.id) }} search={search}><Badge tone={a.id === developerId ? "accent" : "neutral"}>{a.login}</Badge></Link>)}
        </div>
      ) : null}
      <FilterBar showTeam={false} />
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatTile label="Commits" value={data?.summary.commits} icon={GitCommitHorizontal} isLoading={isLoading} hint={data ? `${formatNumber(data.summary.lifetimeCommits)} all time` : undefined} />
          <StatTile label="Repositories" value={data?.summary.repositories} icon={FolderGit2} isLoading={isLoading} hint="touched in this period" />
          <StatTile label="Merge commits" value={data?.summary.mergeCommits} icon={GitMerge} isLoading={isLoading} />
          <StatTile label="First commit" value={data?.summary.firstCommitAt ? formatDate(data.summary.firstCommitAt, timezone) : undefined} icon={GitCommitHorizontal} isLoading={isLoading} hint="all time" />
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2"><TrendChart data={data?.dailyTrend ?? []} isLoading={isLoading} title="Commits over time" /></div>
          <HourlyChart data={data?.hourlyActivity ?? []} isLoading={isLoading} timezone={timezone} />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard title="Repository breakdown" description="Where this person's commits went" isLoading={isLoading} height={280}
            table={{ columns: [{ key: "repo", header: "Repository" }, { key: "commits", header: "Commits", align: "right" }], rows: (data?.repositories ?? []).map((r) => ({ repo: r.name, commits: r.commits })) }}>
            <RankedBars emptyLabel="No commits in this period" items={(data?.repositories ?? []).map((r) => ({
              key: r.id, label: r.name, value: r.commits,
              wrap: (row: ReactElement) => <Link to="/repositories/$repositoryId" params={{ repositoryId: String(r.id) }} search={search} className="-mx-2 block rounded-lg px-2 py-1 hover:bg-surface-2">{row}</Link>,
            }))} />
          </ChartCard>
          <ActivityCalendar data={data?.dailyTrend ?? []} isLoading={isLoading} />
        </div>
        <Card className="rise">
          <CardHeader><div><CardTitle>Recent commits</CardTitle><CardDescription>Latest activity from this developer</CardDescription></div></CardHeader>
          <CardContent>{isLoading ? <Skeleton className="h-56 w-full" /> : <CommitList commits={data?.recentCommits ?? []} timezone={timezone} />}</CardContent>
        </Card>
      </div>
    </>
  );
}

function BackLink(): ReactElement {
  const { search } = useFilters();
  return <Link to="/developers" search={search} className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg"><ArrowLeft aria-hidden className="size-4" />All developers</Link>;
}
