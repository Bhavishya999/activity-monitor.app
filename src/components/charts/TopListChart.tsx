import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type TopItem = { label: string; count: number };

type TopListChartProps = {
  data: TopItem[];
  label?: string;
  color?: string;
};

export function TopListChart({ data, label = "Commits", color = "var(--color-foreground)" }: TopListChartProps) {
  if (data.length === 0) {
    return <div className="flex h-32 items-center justify-center text-xs text-muted-foreground">No data</div>;
  }

  // Truncate long labels
  const display = data.map((d) => ({
    ...d,
    displayLabel: d.label.length > 22 ? `…${d.label.slice(-20)}` : d.label,
  }));

  return (
    <ResponsiveContainer width="100%" height={Math.max(120, display.length * 28)}>
      <BarChart data={display} layout="vertical" margin={{ top: 0, right: 8, bottom: 0, left: 4 }}>
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="displayLabel"
          width={140}
          tick={{ fontSize: 11, fill: "var(--color-foreground)" }}
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
          formatter={(value: number) => [value.toLocaleString(), label]}
          labelFormatter={(v: string) =>
            display.find((d) => d.displayLabel === v)?.label ?? v
          }
        />
        <Bar dataKey="count" radius={[0, 2, 2, 0]}>
          {display.map((_, i) => (
            <Cell key={i} fill={color} opacity={1 - i * 0.07} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
