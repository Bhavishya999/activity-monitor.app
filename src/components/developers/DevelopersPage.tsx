import { Search, Users } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { ReactElement } from "react";
import { EmptyState } from "@/components/core/EmptyState";
import { ErrorState } from "@/components/core/ErrorState";
import { FilterBar } from "@/components/core/FilterBar";
import { PageHeader } from "@/components/core/PageHeader";
import { Pagination } from "@/components/core/Pagination";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useDevelopers } from "@/hooks/useDevelopers";
import { useFilters } from "@/hooks/useFilters";
import { PAGE_SIZES } from "@/lib/constants/app-constants";
import { formatNumber, formatRelative } from "@/lib/format";

export default function DevelopersPage(): ReactElement {
  const { search, update } = useFilters();
  const { data, isLoading, isError, error, refetch } = useDevelopers(search);

  return (
    <>
      <PageHeader title="Developers" description="Everyone with commits in the selected period, matched by GitHub account" />
      <FilterBar />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-72">
          <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint" />
          <Input aria-label="Search developers" className="pl-9" placeholder="Search by GitHub login or name" defaultValue={search.q ?? ""} key={search.q ?? ""}
            onKeyDown={(e) => { if (e.key === "Enter") update({ q: e.currentTarget.value.trim() || undefined }); }}
            onBlur={(e) => { const next = e.currentTarget.value.trim() || undefined; if (next !== search.q) update({ q: next }); }} />
        </div>
        <Select id="sort" label="Sort developers" value={search.sort} onChange={(e) => { update({ sort: e.target.value === "latest" ? "latest" : e.target.value === "name" ? "name" : "commits" }); }}>
          <option value="commits">Most commits</option><option value="latest">Most recent activity</option><option value="name">Name (A to Z)</option>
        </Select>
      </div>
      {isError ? <ErrorState error={error} onRetry={() => { void refetch(); }} /> : !isLoading && data?.total === 0 ? (
        <EmptyState icon={Users} title="No developers match" description="Nobody has commits for these filters. Try a wider date range or clear the search." />
      ) : (
        <Card className="rise overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="bg-surface-2 text-xs text-muted">
                <tr>
                  <th scope="col" className="px-4 py-2.5 text-left font-medium">Developer</th>
                  <th scope="col" className="px-4 py-2.5 text-right font-medium">Commits</th>
                  <th scope="col" className="hidden px-4 py-2.5 text-right font-medium sm:table-cell">Repos</th>
                  <th scope="col" className="hidden px-4 py-2.5 text-right font-medium md:table-cell">Merges</th>
                  <th scope="col" className="hidden px-4 py-2.5 text-right font-medium md:table-cell">Lines +/-</th>
                  <th scope="col" className="px-4 py-2.5 text-right font-medium">Last active</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? Array.from({ length: 8 }, (_, i) => <tr key={i} className="border-t border-border"><td colSpan={6} className="px-4 py-3"><Skeleton className="h-6 w-full" /></td></tr>) : data?.items.map((d) => (
                  <tr key={d.id} className="border-t border-border hover:bg-surface-2">
                    <td className="px-4 py-2.5">
                      <Link to="/developers/$developerId" params={{ developerId: String(d.id) }} search={search} className="flex items-center gap-3">
                        <Avatar login={d.login} src={d.avatarUrl} />
                        <span className="min-w-0"><span className="block truncate font-medium text-fg">{d.employee?.name ?? d.login}</span>
                          <span className="block truncate text-xs text-faint">{d.employee ? d.login : d.isBot ? "bot account" : "GitHub account"}</span></span>
                        {d.isBot ? <Badge>Bot</Badge> : null}
                      </Link>
                    </td>
                    <td className="px-4 py-2.5 text-right font-medium tabular">{formatNumber(d.commits)}</td>
                    <td className="hidden px-4 py-2.5 text-right tabular text-muted sm:table-cell">{formatNumber(d.repositories)}</td>
                    <td className="hidden px-4 py-2.5 text-right tabular text-muted md:table-cell">{formatNumber(d.mergeCommits)}</td>
                    <td className="hidden px-4 py-2.5 text-right tabular md:table-cell">{d.additions === null && d.deletions === null ? <span className="text-faint">--</span> : <><span style={{ color: "var(--good)" }}>+{formatNumber(d.additions ?? 0)}</span> <span style={{ color: "var(--critical)" }}>-{formatNumber(d.deletions ?? 0)}</span></>}</td>
                    <td className="px-4 py-2.5 text-right text-muted">{formatRelative(d.latestCommitAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data ? <div className="border-t border-border px-4 pb-3"><Pagination page={data.page} pageSize={PAGE_SIZES.table} total={data.total} onPageChange={(page) => { update({ page }); }} /></div> : null}
        </Card>
      )}
    </>
  );
}
