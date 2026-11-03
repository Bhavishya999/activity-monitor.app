import { useState, useCallback } from "react";
import { Search } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useDevelopers } from "../hooks/useAnalytics";
import { FilterBar, type FilterValues } from "../components/core/FilterBar";
import { PageHeader } from "../components/core/PageHeader";
import { Pagination } from "../components/core/Pagination";
import { ErrorState } from "../components/core/ErrorState";
import { EmptyState } from "../components/core/EmptyState";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
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

export function DevelopersPage() {
  const [filter, setFilter] = useState<FilterValues>(DEFAULT_FILTER);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, error, refetch } = useDevelopers({ ...filter, page, pageSize: PAGE_SIZE });

  const handleFilterChange = useCallback((next: FilterValues) => {
    setFilter(next);
    setPage(1);
  }, []);

  const developers = data?.developers ?? [];
  const filtered = search.trim()
    ? developers.filter((d) => d.login.toLowerCase().includes(search.toLowerCase()))
    : developers;

  return (
    <div className="space-y-5 p-6">
      <PageHeader title="Developers" subtitle="All contributors tracked in this period" />
      <FilterBar value={filter} onChange={handleFilterChange} />

      {isError && <ErrorState error={error} onRetry={() => void refetch()} />}

      <Card>
        {/* Toolbar */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Filter by login…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-8 text-xs"
            />
          </div>
          {data && (
            <p className="ml-auto text-xs text-muted-foreground">
              {data.total.toLocaleString()} developers
            </p>
          )}
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Developer</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Commits</TableHead>
              <TableHead className="text-right">Last Active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-7 w-7 rounded-full" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="ml-auto h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="ml-auto h-4 w-24" /></TableCell>
                  </TableRow>
                ))
              : filtered.length === 0
              ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-12">
                      <EmptyState title={search ? "No matching developers" : "No developers in this period"} />
                    </TableCell>
                  </TableRow>
                )
              : filtered.map((dev) => (
                  <TableRow key={dev.id}>
                    <TableCell>
                      <Link
                        to="/dashboard/developers/$id"
                        params={{ id: String(dev.id) }}
                        className="flex items-center gap-3 font-medium hover:underline"
                      >
                        <Avatar className="h-7 w-7 shrink-0">
                          {dev.avatarUrl && <AvatarImage src={dev.avatarUrl} alt={dev.login} />}
                          <AvatarFallback>{dev.login.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        {dev.login}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant={dev.type === "Bot" ? "warning" : "muted"}>{dev.type}</Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">
                      {dev.commitCount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">
                      {dev.lastCommittedAt
                        ? new Date(dev.lastCommittedAt).toLocaleDateString("en-US", {
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
    </div>
  );
}
