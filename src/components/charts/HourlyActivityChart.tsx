import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { HourlyPoint } from "../../lib/interfaces/analytics";

// Fill all 24 hours with 0s if missing so the x-axis is always complete
function fillHours(data: HourlyPoint[]): HourlyPoint[] {
  const byHour = new Map(data.map((d) => [d.hour, d.count]));
  return Array.from({ length: 24 }, (_, h) => ({ hour: h, count: byHour.get(h) ?? 0 }));
}

function formatHour(h: number): string {
  if (h === 0) return "12am";
  if (h === 12) return "12pm";
  return h < 12 ? `${h}am` : `${h - 12}pm`;
}

type HourlyActivityChartProps = { data: HourlyPoint[] };

export function HourlyActivityChart({ data }: HourlyActivityChartProps) {
  const filled = fillHours(data);

  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={filled} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        <XAxis
          dataKey="hour"
          tickFormatter={formatHour}
          tick={{ fontSize: 9, fill: "var(--color-muted-foreground)" }}
          axisLine={false}
          tickLine={false}
          interval={3}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: "var(--color-card)",
            border: "1px solid var(--color-border)",
            borderRadius: "6px",
            fontSize: 12,
          }}
          labelFormatter={(h: number) => formatHour(h)}
          formatter={(value: number) => [value.toLocaleString(), "Commits"]}
        />
        <Bar dataKey="count" fill="var(--color-foreground)" opacity={0.7} radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
