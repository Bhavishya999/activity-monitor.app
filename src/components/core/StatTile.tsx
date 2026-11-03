import type { LucideIcon } from "lucide-react";
import type { ReactElement } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber, NO_VALUE } from "@/lib/format";

type StatTileProps = { label: string; value: number | string | null | undefined; hint?: string | undefined; icon: LucideIcon; isLoading: boolean };

export function StatTile({ label, value, hint, icon: Icon, isLoading }: StatTileProps): ReactElement {
  return (
    <Card className="rise p-4">
      <div className="flex items-center justify-between text-muted">
        <span className="text-xs font-medium">{label}</span>
        <span className="rounded-md bg-accent-soft p-1.5 text-accent-strong"><Icon aria-hidden className="size-3.5" /></span>
      </div>
      {isLoading ? <Skeleton className="mt-3 h-8 w-24" /> : <div className="mt-2 text-3xl font-semibold tracking-tight tabular text-fg">{value === null || value === undefined ? NO_VALUE : typeof value === "number" ? formatNumber(value) : value}</div>}
      {hint ? <div className="mt-1 text-xs text-faint">{hint}</div> : null}
    </Card>
  );
}
