import type { ReactElement, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { formatNumber, formatPercent } from "@/lib/format";

export type RankedItem = { key: string | number; label: string; value: number; leading?: ReactNode; wrap?: (row: ReactElement) => ReactElement; muted?: boolean; note?: string };

type RankedBarsProps = { items: RankedItem[]; total?: number; unit?: string; emptyLabel: string };

/** Ranked horizontal bars as plain HTML: direct labels and values, one hue, bars anchored to the baseline. */
export function RankedBars({ items, total, unit = "commits", emptyLabel }: RankedBarsProps): ReactElement {
  if (items.length === 0) return <p className="py-10 text-center text-sm text-faint">{emptyLabel}</p>;
  const max = Math.max(...items.map((i) => i.value), 1);
  const sum = total ?? items.reduce((s, i) => s + i.value, 0);
  return (
    <ol className="space-y-2.5">
      {items.map((item, index) => {
        const row = (
          <div className="group grid grid-cols-[1.25rem_minmax(0,1fr)_auto] items-center gap-x-3">
            <span className="text-right text-xs tabular text-faint">{index + 1}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {item.leading}
                <span className={cn("truncate text-sm", item.muted ? "text-muted italic" : "text-fg group-hover:text-accent-strong")} title={item.label}>{item.label}</span>
                {item.note ? <span className="text-xs text-faint">{item.note}</span> : null}
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                <div className="h-full rounded-full" style={{ width: `${Math.max(2, (item.value / max) * 100)}%`, background: item.muted ? "var(--series-other)" : "var(--series-1)" }} />
              </div>
            </div>
            <div className="text-right"><div className="text-sm font-medium tabular text-fg">{formatNumber(item.value)}</div><div className="text-xs tabular text-faint">{formatPercent(item.value, sum)}</div></div>
          </div>
        );
        return (
          <li key={item.key} aria-label={`${item.label}: ${item.value} ${unit}`}>
            {item.wrap ? item.wrap(row) : row}
          </li>
        );
      })}
    </ol>
  );
}
