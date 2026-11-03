import { FolderGit2, Lock, Search } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { ReactElement } from "react";
import { EmptyState } from "@/components/core/EmptyState";
import { ErrorState } from "@/components/core/ErrorState";
import { FilterBar } from "@/components/core/FilterBar";
import { PageHeader } from "@/components/core/PageHeader";
import { Pagination } from "@/components/core/Pagination";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useFilters } from "@/hooks/useFilters";
import { useRepositories } from "@/hooks/useRepositories";
import { PAGE_SIZES } from "@/lib/constants/app-constants";
import { formatNumber, formatRelative } from "@/lib/format";

export default function RepositoriesPage(): ReactElement {
  const { search, update } = useFilters();
  const { data, isLoading, isError, error, refetch } = useRepositories(search);

  return (
    <>
      <PageHeader title="Repositories" description="Every repository the GitHub App can see, with activity for the selected period" />
      <FilterBar showTeam={false} />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-72">
          <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint" />
          <Input aria-label="Search repositories" className="pl-9" placeholder="Search repositories" defaultValue={search.q ?? ""} key={search.q ?? ""}
            onKeyDown={(e) => { if (e.key === "Enter") update({ q: e.currentTarget.value.trim() || undefined }); }}
            onBlur={(e) => { const next = e.currentTarget.value.trim() || undefined; if (next !== search.q) update({ q: next }); }} />
        </div>
        <Select id="sort" label="Sort repositories" value={search.sort} onChange={(e) => { update({ sort: e.target.value === "latest" ? "latest" : e.target.value === "name" ? "name" : "commits" }); }}>
          <option value="commits">Most commits</option><option value="latest">Most recent activity</option><option value="name">Name (A to Z)</option>
        </Select>
      </div>
      {isError ? <ErrorState error={error} onRetry={() => { void refetch(); }} /> : !isLoading && data?.total === 0 ? (
        <EmptyState icon={FolderGit2} title="No repositories yet" description="Install the GitHub App on an organization and repositories will appear here after discovery." />
      ) : (
        <Card className="rise overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-sm">
              <thead className="bg-surface-2 text-xs text-muted">
                <tr>
                  <th scope="col" className="px-4 py-2.5 text-left font-medium">Repository</th>
                  <th scope="col" className="px-4 py-2.5 text-right font-medium">Commits</th>
                  <th scope="col" className="hidden px-4 py-2.5 text-right font-medium sm:table-cell">Contributors</th>
                  <th scope="col" className="px-4 py-2.5 text-right font-medium">Last commit</th>
                  <th scope="col" className="hidden px-4 py-2.5 text-right font-medium md:table-cell">Last synced</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? Array.from({ length: 8 }, (_, i) => <tr key={i} className="border-t border-border"><td colSpan={5} className="px-4 py-3"><Skeleton className="h-6 w-full" /></td></tr>) : data?.items.map((r) => (
                  <tr key={r.id} className="border-t border-border hover:bg-surface-2">
                    <td className="px-4 py-2.5">
                      <Link to="/repositories/$repositoryId" params={{ repositoryId: String(r.id) }} search={search} className="flex items-center gap-2">
                        <span className="min-w-0"><span className="block truncate font-medium text-fg">{r.name}</span><span className="block text-xs text-faint">{r.account}</span></span>
                        {r.isPrivate ? <Badge><Lock aria-hidden className="size-3" />Private</Badge> : null}
                        {r.isArchived ? <Badge tone="warning">Archived</Badge> : null}
                        {!r.isAccessible ? <Badge tone="critical">No access</Badge> : null}
                      </Link>
                    </td>
                    <td className="px-4 py-2.5 text-right font-medium tabular">{formatNumber(r.commits)}</td>
                    <td className="hidden px-4 py-2.5 text-right tabular text-muted sm:table-cell">{formatNumber(r.contributors)}</td>
                    <td className="px-4 py-2.5 text-right text-muted">{formatRelative(r.latestCommitAt)}</td>
                    <td className="hidden px-4 py-2.5 text-right text-muted md:table-cell">{formatRelative(r.lastSyncedAt)}</td>
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
