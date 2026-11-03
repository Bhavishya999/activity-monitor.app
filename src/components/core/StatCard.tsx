import { Skeleton } from "../ui/skeleton";

type StatCardProps = {
  label: string;
  value: string | number | null | undefined;
  icon: React.ElementType;
  loading?: boolean | undefined;
  note?: string | undefined;
  trend?: { value: number; label: string } | undefined;
};

export function StatCard({ label, value, icon: Icon, loading, note, trend }: StatCardProps) {
  return (
    <div
      className="group rounded-xl border border-border bg-card p-5 transition-shadow duration-200 hover:shadow-md"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[13px] font-medium text-muted-foreground">{label}</p>
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors"
          style={{ background: "oklch(0.945 0.040 265)" }}
        >
          <Icon
            className="h-4 w-4"
            style={{ color: "oklch(0.560 0.230 265)" }}
            aria-hidden
          />
        </div>
      </div>

      {loading ? (
        <Skeleton className="mt-3 h-8 w-24" />
      ) : (
        <p className="mt-3 text-[28px] font-bold tracking-tight tabular-nums leading-none">
          {value === null || value === undefined
            ? "—"
            : typeof value === "number"
            ? value.toLocaleString()
            : value}
        </p>
      )}

      <div className="mt-2 flex items-center gap-3">
        {note && <p className="text-[11px] text-muted-foreground">{note}</p>}
        {trend && !loading && (
          <span
            className="text-[11px] font-medium tabular-nums"
            style={{ color: trend.value >= 0 ? "oklch(0.490 0.175 150)" : "oklch(0.577 0.245 27)" }}
          >
            {trend.value >= 0 ? "+" : ""}{trend.value}% {trend.label}
          </span>
        )}
      </div>
    </div>
  );
}
