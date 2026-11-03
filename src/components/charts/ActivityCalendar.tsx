import type { ReactElement } from "react";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/cn";
import { formatDay, formatWeekday } from "@/lib/format";
import type { DailyPoint } from "@/lib/interfaces/analytics";
import { ChartCard } from "./ChartCard";

const LEVELS = ["var(--seq-0)", "var(--seq-1)", "var(--seq-2)", "var(--seq-3)", "var(--seq-4)", "var(--seq-5)"] as const;
const WEEKDAY_LABELS = ["Mon", "", "Wed", "", "Fri", "", ""] as const;

/** Level 0 is "no commits"; levels 1 to 5 are quintiles of the non-zero days so one huge day does not wash out the rest. */
export function levelFor(value: number, thresholds: readonly number[]): number {
  if (value <= 0) return 0;
  const idx = thresholds.findIndex((t) => value <= t);
  return (idx === -1 ? thresholds.length : idx) + 1;
}

export function quantileThresholds(values: readonly number[]): number[] {
  const sorted = values.filter((v) => v > 0).sort((a, b) => a - b);
  if (sorted.length === 0) return [1, 2, 3, 4];
  return [0.2, 0.4, 0.6, 0.8].map((q) => sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))] ?? 1);
}

function weekdayIndex(day: string): number {
  return (new Date(`${day}T00:00:00Z`).getUTCDay() + 6) % 7; // Monday = 0
}

type ActivityCalendarProps = { data: DailyPoint[]; isLoading: boolean; title?: string };

export function ActivityCalendar({ data, isLoading, title = "Activity calendar" }: ActivityCalendarProps): ReactElement {
  const thresholds = quantileThresholds(data.map((d) => d.commits));
  // Pad the first week so columns are Monday to Sunday.
  const first = data[0];
  const pad = first ? weekdayIndex(first.day) : 0;
  const cells: (DailyPoint | null)[] = [...Array.from({ length: pad }, () => null), ...data];
  const weeks: (DailyPoint | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  // Few weeks get bigger squares so the card is not mostly empty; long ranges stay compact.
  const cell = weeks.length <= 6 ? 24 : weeks.length <= 14 ? 18 : 13;

  return (
    <ChartCard
      title={title} description="Each square is a day; darker means more commits" isLoading={isLoading} height={170}
      table={{ columns: [{ key: "day", header: "Day" }, { key: "commits", header: "Commits", align: "right" }], rows: data.map((d) => ({ day: d.day, commits: d.commits })) }}
    >
      <TooltipProvider>
        <div className="overflow-x-auto pb-1">
          <div className="inline-flex gap-1.5" role="img" aria-label={`${title}: ${data.length} days`}>
            <div className="flex flex-col gap-[3px] pr-1 text-[10px] text-faint">{WEEKDAY_LABELS.map((l, i) => <span key={i} className="flex items-center" style={{ height: cell }}>{l}</span>)}</div>
            {weeks.map((week, w) => (
              <div key={w} className="flex flex-col gap-[3px]">
                {Array.from({ length: 7 }, (_, d) => {
                                    const point = week[d];
                  if (!point) return <span key={d} style={{ width: cell, height: cell }} />;
                  const level = levelFor(point.commits, thresholds);
                  return (
                    <Tooltip key={d} content={<span><strong className="tabular">{point.commits}</strong> commits, {formatWeekday(point.day)} {formatDay(point.day)}</span>}>
                      <span tabIndex={0} aria-label={`${point.day}: ${point.commits} commits`} className={cn("rounded-[4px] outline-offset-1 transition-transform hover:scale-110")} style={{ width: cell, height: cell, background: LEVELS[level], boxShadow: level === 0 ? "inset 0 0 0 1px var(--border)" : "none" }} />
                    </Tooltip>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-3 flex items-center justify-end gap-1.5 text-[11px] text-faint">
          Less {LEVELS.map((c, i) => <span key={i} aria-hidden className="size-3 rounded-[3px]" style={{ background: c, boxShadow: i === 0 ? "inset 0 0 0 1px var(--border)" : "none" }} />)} More
        </div>
      </TooltipProvider>
    </ChartCard>
  );
}
