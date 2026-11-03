import { useState, useCallback } from "react";
import { Search } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useRepositories } from "../hooks/useAnalytics";
import { TableFetchingOverlay } from "../components/core/TableFetchingOverlay";
import { FilterBar, type FilterValues } from "../components/core/FilterBar";
import { PageHeader } from "../components/core/PageHeader";
import { Pagination } from "../components/core/Pagination";
import { ErrorState } from "../components/core/ErrorState";
import { EmptyState } from "../components/core/EmptyState";
import { Badge } from "../components/ui/badge";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Skeleton } from "../components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../components/ui/table";

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

const PAGE_SIZE = 25;

export function RepositoriesPage() {
  const [filter, setFilter] = useState<FilterValues>(DEFAULT_FILTER);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading, isFetching, isPlaceholderData, isError, error, refetch } = useRepositories({ ...filter, page, pageSize: PAGE_SIZE });

  const handleFilterChange = useCallback((next: FilterValues) => {
    setFilter(next);
    setPage(1);
  }, []);

  const repos = data?.repositories ?? [];
  const filtered = search.trim()
    ? repos.filter((r) => r.fullName.toLowerCase().includes(search.toLowerCase()))
    : repos;

  return (
    <div className="space-y-5 p-6">
      <PageHeader title="Repositories" subtitle="All tracked repositories" />
      <FilterBar value={filter} onChange={handleFilterChange} />

      {isError && <ErrorState error={error} onRetry={() => void refetch()} />}

      <TableFetchingOverlay isFetching={isFetching} isPlaceholderData={isPlaceholderData}>
      <Card>
        {/* Toolbar */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Filter by name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-8 text-xs"
            />
          </div>
          {data && (
            <p className="ml-auto text-xs text-muted-foreground">
              {data.total.toLocaleString()} repositories
            </p>
          )}
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Repository</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Commits</TableHead>
              <TableHead className="text-right">Last Commit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                    <TableCell><Skeleton className="ml-auto h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="ml-auto h-4 w-24" /></TableCell>
                  </TableRow>
                ))
              : filtered.length === 0
              ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-12">
                      <EmptyState title={search ? "No matching repositories" : "No repositories in this period"} />
                    </TableCell>
                  </TableRow>
                )
              : filtered.map((repo) => (
                  <TableRow key={repo.id}>
                    <TableCell>
                      <Link
                        to="/dashboard/repositories/$id"
                        params={{ id: String(repo.id) }}
                        className="font-medium hover:underline"
                      >
                        {repo.fullName}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {repo.private && <Badge variant="muted">Private</Badge>}
                        {repo.archived && <Badge variant="warning">Archived</Badge>}
                        {repo.monitored && <Badge variant="success">Monitored</Badge>}
                        {!repo.accessible && <Badge variant="danger">No Access</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">
                      {repo.commitCount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">
                      {repo.lastCommittedAt
                        ? new Date(repo.lastCommittedAt).toLocaleDateString("en-US", {
                            month: "short", day: "numeric", year: "numeric",
                          })
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>

        {data && data.total > PAGE_SIZE && (
          <div className="px-4 pb-4">
            <Pagination page={page} pageSize={PAGE_SIZE} total={data.total} onChange={setPage} />
          </div>
        )}
      </Card>
      </TableFetchingOverlay>
    </div>
  );
}
