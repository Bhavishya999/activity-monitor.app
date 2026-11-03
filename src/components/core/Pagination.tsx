import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactElement } from "react";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/format";

type PaginationProps = { page: number; pageSize: number; total: number; onPageChange: (page: number) => void };

export function Pagination({ page, pageSize, total, onPageChange }: PaginationProps): ReactElement | null {
  if (total === 0) return null;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);
  return (
    <nav aria-label="Pagination" className="flex items-center justify-between gap-3 px-1 pt-3 text-sm text-muted">
      <span className="tabular">{formatNumber(from)}-{formatNumber(to)} of {formatNumber(total)}</span>
      <div className="flex items-center gap-1">
        <Button size="icon" variant="ghost" aria-label="Previous page" disabled={page <= 1} onClick={() => { onPageChange(page - 1); }}><ChevronLeft className="size-4" /></Button>
        <span className="px-2 tabular">Page {page} of {pages}</span>
        <Button size="icon" variant="ghost" aria-label="Next page" disabled={page >= pages} onClick={() => { onPageChange(page + 1); }}><ChevronRight className="size-4" /></Button>
      </div>
    </nav>
  );
}
