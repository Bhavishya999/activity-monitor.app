import type { ReactElement } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCompact, formatDay, formatWeekday } from "@/lib/format";
import type { DailyPoint } from "@/lib/interfaces/analytics";
import { ChartCard } from "./ChartCard";
import { ChartTooltip } from "./ChartTooltip";

type TrendChartProps = { data: DailyPoint[]; isLoading: boolean; title?: string; description?: string; height?: number };

const BAR_THRESHOLD = 14;

export function TrendChart({ data, isLoading, title = "Commits over time", description = "Commits per day in the reporting time zone", height = 260 }: TrendChartProps): ReactElement {
  const rows = data.map((d) => ({ ...d, label: formatDay(d.day) }));
  const tickGap = Math.max(1, Math.ceil(rows.length / 8));
  const tooltip = <Tooltip cursor={{ stroke: "var(--border-strong)", strokeWidth: 1 }} content={<ChartTooltip unit="commits" title={(p) => `${formatWeekday(String(p["day"]))}, ${String(p["label"])}`} />} />;
  const axes = (
    <>
      <CartesianGrid vertical={false} strokeDasharray="0" />
      <XAxis dataKey="label" tickLine={false} axisLine={false} interval={tickGap - 1} tickMargin={8} />
      <YAxis tickLine={false} axisLine={false} width={36} allowDecimals={false} tickFormatter={(v: number) => formatCompact(v)} />
    </>
  );

  return (
    <ChartCard
      title={title} description={description} isLoading={isLoading} height={height}
      table={{ columns: [{ key: "day", header: "Day" }, { key: "commits", header: "Commits", align: "right" }], rows: data.map((d) => ({ day: d.day, commits: d.commits })) }}
    >
      {rows.length === 0 ? null : rows.length === 1 ? (
        <SingleDay point={rows[0]} />
      ) : (
        <div role="img" aria-label={`${title}: ${rows.length} days`} style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            {rows.length <= BAR_THRESHOLD ? (
              <BarChart data={rows} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
                {axes}{tooltip}
                <Bar dataKey="commits" fill="var(--series-1)" radius={[4, 4, 0, 0]} maxBarSize={36} />
              </BarChart>
            ) : (
              <AreaChart data={rows} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--series-1)" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="var(--series-1)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                {axes}{tooltip}
                <Area type="monotone" dataKey="commits" stroke="var(--series-1)" strokeWidth={2} fill="url(#trend-fill)" activeDot={{ r: 5, stroke: "var(--surface)", strokeWidth: 2, fill: "var(--series-1)" }} />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      )}
    </ChartCard>
  );
}

function SingleDay({ point }: { point: { label: string; commits: number } | undefined }): ReactElement {
  return (
    <div className="flex h-[220px] flex-col items-center justify-center text-center">
      <div className="text-5xl font-semibold tabular text-fg">{point?.commits.toLocaleString("en") ?? "--"}</div>
      <div className="mt-1 text-sm text-muted">commits on {point?.label}</div>
      <div className="mt-3 text-xs text-faint">One day selected, see hourly activity for the shape of the day.</div>
    </div>
  );
}
