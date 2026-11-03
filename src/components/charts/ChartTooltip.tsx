import type { ReactElement } from "react";

type Payload = { value?: number | string; payload?: Record<string, unknown> };
type ChartTooltipProps = {
  active?: boolean | undefined;
  payload?: readonly Payload[] | undefined;
  title: (payload: Record<string, unknown>) => string;
  unit: string;
};

/** Tooltip body in text tokens (never the series colour) with a swatch carrying identity. */
export function ChartTooltip({ active, payload, title, unit }: ChartTooltipProps): ReactElement | null {
  const first = payload?.[0];
  if (!active || !first?.payload) return null;
  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 text-xs shadow-pop">
      <div className="font-medium text-fg">{title(first.payload)}</div>
      <div className="mt-1 flex items-center gap-2 text-muted">
        <span aria-hidden className="size-2 rounded-sm" style={{ background: "var(--series-1)" }} />
        <span className="tabular text-fg font-semibold">{Number(first.value ?? 0).toLocaleString("en")}</span> {unit}
      </div>
    </div>
  );
}
