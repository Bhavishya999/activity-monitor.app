import type { ReactElement } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCompact, formatHour } from "@/lib/format";
import type { HourPoint } from "@/lib/interfaces/analytics";
import { ChartCard } from "./ChartCard";
import { ChartTooltip } from "./ChartTooltip";

type HourlyChartProps = { data: HourPoint[]; isLoading: boolean; timezone: string; height?: number };

export function HourlyChart({ data, isLoading, timezone, height = 260 }: HourlyChartProps): ReactElement {
  const total = data.reduce((sum, d) => sum + d.commits, 0);
  const rows = data.map((d) => ({ ...d, label: formatHour(d.hour) }));
  return (
    <ChartCard
      title="Activity by hour" description={`When commits happen across the day (${timezone})`} isLoading={isLoading} height={height}
      table={{ columns: [{ key: "hour", header: "Hour" }, { key: "commits", header: "Commits", align: "right" }], rows: rows.map((r) => ({ hour: r.label, commits: r.commits })) }}
    >
      {total === 0 ? null : (
        <div role="img" aria-label="Commits by hour of day" style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows} margin={{ top: 8, right: 4, left: 0, bottom: 0 }} barCategoryGap={3}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} interval={2} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} width={36} allowDecimals={false} tickFormatter={(v: number) => formatCompact(v)} />
              <Tooltip cursor={{ fill: "var(--surface-2)" }} content={<ChartTooltip unit="commits" title={(p) => `${String(p["label"])} to ${formatHour((Number(p["hour"]) + 1) % 24)}`} />} />
              <Bar dataKey="commits" fill="var(--series-1)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartCard>
  );
}
