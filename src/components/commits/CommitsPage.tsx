import { GitCommitHorizontal, Search } from "lucide-react";
import type { ReactElement } from "react";
import { CommitList } from "@/components/commits/CommitList";
import { EmptyState } from "@/components/core/EmptyState";
import { ErrorState } from "@/components/core/ErrorState";
import { FilterBar } from "@/components/core/FilterBar";
import { PageHeader } from "@/components/core/PageHeader";
import { Pagination } from "@/components/core/Pagination";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnalyticsMeta } from "@/hooks/useAnalyticsMeta";
import { useCommits } from "@/hooks/useCommits";
import { useFilters } from "@/hooks/useFilters";
import { PAGE_SIZES } from "@/lib/constants/app-constants";

export default function CommitsPage(): ReactElement {
  const { search, update } = useFilters();
  const { timezone } = useAnalyticsMeta();
  const { data, isLoading, isError, error, refetch } = useCommits(search);

  return (
    <>
      <PageHeader title="Commit history" description="Search every commit by message, SHA, repository or author" />
      <FilterBar showTeam />
      <div className="relative mb-4 w-full sm:w-96">
        <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint" />
        <Input aria-label="Search commits" className="pl-9" placeholder="Search commits" defaultValue={search.q ?? ""} key={search.q ?? ""}
          onKeyDown={(e) => { if (e.key === "Enter") update({ q: e.currentTarget.value.trim() || undefined }); }}
          onBlur={(e) => { const next = e.currentTarget.value.trim() || undefined; if (next !== search.q) update({ q: next }); }} />
      </div>
      {isError ? <ErrorState error={error} onRetry={() => { void refetch(); }} /> : !isLoading && data?.total === 0 ? (
        <EmptyState icon={GitCommitHorizontal} title="No commits found" description="Nothing matches these filters. Try a wider date range or a different search." />
      ) : (
        <Card className="rise">
          <CardContent className="pt-1">
            {isLoading ? <Skeleton className="mt-3 h-96 w-full" /> : <CommitList commits={data?.items ?? []} timezone={timezone} />}
            {data ? <Pagination page={data.page} pageSize={PAGE_SIZES.commits} total={data.total} onPageChange={(page) => { update({ page }); }} /> : null}
          </CardContent>
        </Card>
      )}
    </>
  );
}
