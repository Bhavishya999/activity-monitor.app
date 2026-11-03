import { Building2 } from "lucide-react";
import type { ReactElement } from "react";
import { EmptyState } from "@/components/core/EmptyState";
import { ErrorState } from "@/components/core/ErrorState";
import { FilterBar } from "@/components/core/FilterBar";
import { PageHeader } from "@/components/core/PageHeader";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBreakdown } from "@/hooks/useAnalytics";
import { useFilters } from "@/hooks/useFilters";
import { formatNumber, formatRelative } from "@/lib/format";

export default function GitHubAccountsPage(): ReactElement {
  const { search } = useFilters();
  const { data, isLoading, isError, error, refetch } = useBreakdown(search, "organization");

  return (
    <>
      <PageHeader title="GitHub accounts" description="Organizations and accounts the GitHub App is installed on, with their activity in the selected period" />
      <FilterBar showOrganization={false} />
      {isError ? <ErrorState error={error} onRetry={() => { void refetch(); }} /> : !isLoading && (data?.groups.length ?? 0) === 0 ? (
        <EmptyState icon={Building2} title="No GitHub accounts with activity" description="Install the GitHub App on an organization or account. Installing, removing and re-syncing accounts will be managed from this page by admins." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {isLoading ? Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-36" />) : data?.groups.map((g) => (
            <Card key={g.id ?? "none"} className="rise p-5">
              <div className="flex items-center gap-3"><span className="rounded-lg bg-accent-soft p-2 text-accent-strong"><Building2 aria-hidden className="size-4" /></span><h2 className="truncate text-base font-semibold">{g.label ?? "Unknown"}</h2></div>
              <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
                {([["Commits", g.commits], ["Developers", g.developers], ["Repos", g.repositories]] as const).map(([k, v]) => (
                  <div key={k} className="rounded-lg bg-surface-2 py-2"><dd className="text-lg font-semibold tabular">{formatNumber(v)}</dd><dt className="text-[11px] text-faint">{k}</dt></div>
                ))}
              </dl>
              <p className="mt-3 text-xs text-faint">Last commit {formatRelative(g.latestCommitAt)}</p>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
