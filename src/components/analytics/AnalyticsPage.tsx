import { BarChart3 } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import type { ReactElement } from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { RankedBars } from "@/components/charts/RankedBars";
import { EmptyState } from "@/components/core/EmptyState";
import { ErrorState } from "@/components/core/ErrorState";
import { FilterBar } from "@/components/core/FilterBar";
import { PageHeader } from "@/components/core/PageHeader";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/cn";
import { useBreakdown } from "@/hooks/useAnalytics";
import { useFilters } from "@/hooks/useFilters";
import { BREAKDOWN_DIMENSIONS, BREAKDOWN_LABELS, type BreakdownDimension } from "@/lib/constants/filter-constants";
import { analyticsSearchSchema } from "@/lib/filters";
import { formatNumber, formatPercent, formatRelative } from "@/lib/format";
import { useSearch } from "@tanstack/react-router";

export default function AnalyticsPage(): ReactElement {
  const { search } = useFilters();
  const { by } = analyticsSearchSchema.parse(useSearch({ strict: false }));
  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch } = useBreakdown(search, by);
  const total = (data?.groups ?? []).reduce((s, g) => s + g.commits, 0);

  function setBy(next: BreakdownDimension): void {
    void navigate({ to: ".", search: ((prev: Record<string, unknown>) => ({ ...prev, by: next })) as never });
  }

  return (
    <>
      <PageHeader title="Analytics" description="Regroup the same activity by organization, repository, developer or team" />
      <FilterBar />
      <div role="tablist" aria-label="Group by" className="mb-4 flex max-w-full gap-1 overflow-x-auto rounded-xl border border-border bg-surface p-1 shadow-card sm:inline-flex">
        {BREAKDOWN_DIMENSIONS.map((d) => (
          <button key={d} role="tab" type="button" aria-selected={by === d} onClick={() => { setBy(d); }}
            className={cn("shrink-0 rounded-lg px-3 py-1.5 text-sm transition-colors cursor-pointer", by === d ? "bg-accent text-white" : "text-muted hover:text-fg")}>
            {BREAKDOWN_LABELS[d]}
          </button>
        ))}
      </div>
      {isError ? <ErrorState error={error} onRetry={() => { void refetch(); }} /> : !isLoading && (data?.groups.length ?? 0) === 0 ? (
        <EmptyState icon={BarChart3} title="Nothing to group" description={by === "team" ? "No team has members with commits in this period. Create teams and add members on the Teams page." : "No commits match these filters."} />
      ) : (
        <div className="grid gap-4 lg:grid-cols-5">
          <ChartCard className="lg:col-span-2" title={`By ${BREAKDOWN_LABELS[by].toLowerCase()}`} description={by === "team" ? "A person in two teams counts in both" : "Share of commits in the period"} isLoading={isLoading} height={360}
            table={{ columns: [{ key: "group", header: BREAKDOWN_LABELS[by] }, { key: "commits", header: "Commits", align: "right" }], rows: (data?.groups ?? []).map((g) => ({ group: g.label ?? "Unassigned", commits: g.commits })) }}>
            <RankedBars emptyLabel="No data" total={total} items={(data?.groups ?? []).slice(0, 12).map((g, i) => ({ key: g.id ?? `u${i}`, label: g.label ?? "Unassigned", value: g.commits, muted: g.label === null }))} />
          </ChartCard>
          <Card className="rise overflow-hidden lg:col-span-3">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-sm">
                <thead className="bg-surface-2 text-xs text-muted"><tr>
                  <th scope="col" className="px-4 py-2.5 text-left font-medium">{BREAKDOWN_LABELS[by]}</th>
                  <th scope="col" className="px-4 py-2.5 text-right font-medium">Commits</th><th scope="col" className="px-4 py-2.5 text-right font-medium">Share</th>
                  <th scope="col" className="hidden px-4 py-2.5 text-right font-medium sm:table-cell">Developers</th><th scope="col" className="hidden px-4 py-2.5 text-right font-medium sm:table-cell">Repos</th>
                  <th scope="col" className="px-4 py-2.5 text-right font-medium">Last commit</th></tr></thead>
                <tbody>
                  {isLoading ? Array.from({ length: 7 }, (_, i) => <tr key={i} className="border-t border-border"><td colSpan={6} className="px-4 py-3"><Skeleton className="h-6 w-full" /></td></tr>) : data?.groups.map((g, i) => (
                    <tr key={g.id ?? `u${i}`} className="border-t border-border">
                      <td className={cn("px-4 py-2.5 font-medium", g.label === null && "italic text-muted")}>{g.label ?? "Unassigned"}</td>
                      <td className="px-4 py-2.5 text-right tabular font-medium">{formatNumber(g.commits)}</td>
                      <td className="px-4 py-2.5 text-right tabular text-muted">{formatPercent(g.commits, total)}</td>
                      <td className="hidden px-4 py-2.5 text-right tabular text-muted sm:table-cell">{formatNumber(g.developers)}</td>
                      <td className="hidden px-4 py-2.5 text-right tabular text-muted sm:table-cell">{formatNumber(g.repositories)}</td>
                      <td className="px-4 py-2.5 text-right text-muted">{formatRelative(g.latestCommitAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
