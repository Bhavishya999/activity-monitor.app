import { useState, useCallback, memo } from "react";
import { Link } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { useCommits } from "../hooks/useAnalytics";
import { FilterBar, type FilterValues } from "../components/core/FilterBar";
import { PageHeader } from "../components/core/PageHeader";
import { Pagination } from "../components/core/Pagination";
import { ErrorState } from "../components/core/ErrorState";
import { EmptyState } from "../components/core/EmptyState";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Card } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../components/ui/table";
import type { Commit } from "../lib/interfaces/analytics";

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

const PAGE_SIZE = 50;

const CommitRow = memo(function CommitRow({ commit }: { commit: Commit }) {
  const firstLine = commit.message.split("\n")[0] ?? commit.message;
  const truncated = firstLine.length > 80 ? `${firstLine.slice(0, 77)}…` : firstLine;

  return (
    <TableRow>
      <TableCell>
        {commit.htmlUrl ? (
          <a
            href={commit.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground"
          >
            {commit.shortSha}
            <ExternalLink className="h-2.5 w-2.5" />
          </a>
        ) : (
          <span className="font-mono text-xs text-muted-foreground">{commit.shortSha}</span>
        )}
      </TableCell>

      <TableCell className="max-w-[340px]">
        <span className="text-[13px]" title={commit.message}>{truncated}</span>
        {commit.isMerge && <Badge variant="muted" className="ml-2 text-[10px]">merge</Badge>}
      </TableCell>

      <TableCell>
        {commit.author ? (
          <Link
            to="/dashboard/developers/$id"
            params={{ id: String(commit.author.id) }}
            className="inline-flex items-center gap-1.5 hover:underline"
          >
            <Avatar className="h-5 w-5 shrink-0">
              {commit.author.avatarUrl && (
                <AvatarImage src={commit.author.avatarUrl} alt={commit.author.login} />
              )}
              <AvatarFallback>{commit.author.login.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-xs">{commit.author.login}</span>
          </Link>
        ) : (
          <span className="text-xs text-muted-foreground">unknown</span>
        )}
      </TableCell>

      <TableCell>
        <Link
          to="/dashboard/repositories/$id"
          params={{ id: String(commit.repository.id) }}
          className="block max-w-[160px] truncate text-xs text-muted-foreground hover:text-foreground hover:underline"
          title={commit.repository.fullName}
        >
          {commit.repository.fullName}
        </Link>
      </TableCell>

      <TableCell className="text-right">
        {commit.additions !== null || commit.deletions !== null ? (
          <span className="font-mono text-xs">
            {commit.additions !== null && (
              <span className="text-emerald-600 dark:text-emerald-400">+{commit.additions}</span>
            )}
            {commit.additions !== null && commit.deletions !== null && (
              <span className="text-muted-foreground">/</span>
            )}
            {commit.deletions !== null && (
              <span className="text-rose-600 dark:text-rose-400">-{commit.deletions}</span>
            )}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </TableCell>

      <TableCell className="text-right text-xs text-muted-foreground">
        {new Date(commit.authoredAt).toLocaleDateString("en-US", {
          month: "short", day: "numeric", year: "numeric",
        })}
      </TableCell>
    </TableRow>
  );
});

export function CommitsPage() {
  const [filter, setFilter] = useState<FilterValues>(DEFAULT_FILTER);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error, refetch } = useCommits({ ...filter, page, pageSize: PAGE_SIZE });

  const handleFilterChange = useCallback((next: FilterValues) => {
    setFilter(next);
    setPage(1);
  }, []);

  return (
    <div className="space-y-5 p-6">
      <PageHeader title="Commit History" subtitle="All commits across all repositories" />
      <FilterBar value={filter} onChange={handleFilterChange} />

      {isError && <ErrorState error={error} onRetry={() => void refetch()} />}

      <Card>
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="text-xs text-muted-foreground">
            {data ? `${data.total.toLocaleString()} commits` : "—"}
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">SHA</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Repository</TableHead>
              <TableHead className="text-right">Changes</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 10 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-14" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-64" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="ml-auto h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="ml-auto h-4 w-20" /></TableCell>
                  </TableRow>
                ))
              : (data?.commits ?? []).length === 0
              ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-12">
                      <EmptyState title="No commits in this period" />
                    </TableCell>
                  </TableRow>
                )
              : (data?.commits ?? []).map((commit) => (
                  <CommitRow key={commit.id} commit={commit} />
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
