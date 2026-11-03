import { Skeleton } from "../ui/skeleton";

type ChartSkeletonProps = { height?: number | undefined };

export function StatsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-hidden aria-busy="true">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-border bg-card p-5"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <div className="flex items-start justify-between gap-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
          </div>
          <Skeleton className="mt-3 h-8 w-24" />
          <Skeleton className="mt-2 h-3 w-16" />
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton({ height = 208 }: ChartSkeletonProps) {
  return (
    <div aria-hidden aria-busy="true">
      <Skeleton className="w-full rounded-lg" style={{ height }} />
    </div>
  );
}

type TableBodySkeletonProps = { rows?: number | undefined; cols: number[] };

export function TableBodySkeleton({ rows = 8, cols }: TableBodySkeletonProps) {
  return (
    <tbody aria-hidden aria-busy="true">
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b border-border">
          {cols.map((w, j) => (
            <td key={j} className="px-4 py-3">
              <Skeleton className="h-4" style={{ width: w }} />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

export function ProfileHeaderSkeleton() {
  return (
    <div className="flex items-center gap-4" aria-hidden aria-busy="true">
      <Skeleton className="h-12 w-12 rounded-full shrink-0" />
      <div className="space-y-1.5">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-3.5 w-24" />
      </div>
    </div>
  );
}

export function CardToolbarSkeleton() {
  return (
    <div className="flex items-center gap-3 border-b border-border px-4 py-3" aria-hidden aria-busy="true">
      <Skeleton className="h-8 w-48 rounded-md" />
      <Skeleton className="ml-auto h-4 w-24" />
    </div>
  );
}

export function ContributorListSkeleton({ rows = 5 }: { rows?: number | undefined }) {
  return (
    <div className="divide-y divide-border" aria-hidden aria-busy="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-2.5">
          <Skeleton className="h-4 w-4 shrink-0" />
          <Skeleton className="h-7 w-7 rounded-full shrink-0" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-10 shrink-0" />
        </div>
      ))}
    </div>
  );
}
