import { BarChart3, Table2 } from "lucide-react";
import { useState, type ReactElement, type ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/cn";

export type TableColumn = { key: string; header: string; align?: "left" | "right" };
export type TableRow = Record<string, string | number>;

type ChartCardProps = {
  title: string;
  description?: string;
  isLoading: boolean;
  height?: number;
  children: ReactNode;
  /** Accessible alternative to the chart: the same numbers as a table. */
  table?: { columns: TableColumn[]; rows: TableRow[] };
  actions?: ReactNode;
  className?: string;
};

export function ChartCard({ title, description, isLoading, height = 260, children, table, actions, className }: ChartCardProps): ReactElement {
  const [view, setView] = useState<"chart" | "table">("chart");
  return (
    <Card className={cn("rise", className)}>
      <CardHeader>
        <div className="min-w-0">
          <CardTitle>{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </div>
        <div className="flex items-center gap-2">
          {actions}
          {table ? (
            <div role="group" aria-label="Chart or table view" className="inline-flex rounded-lg border border-border p-0.5">
              {([["chart", BarChart3, "Chart view"], ["table", Table2, "Table view"]] as const).map(([id, Icon, label]) => (
                <button
                  key={id} type="button" aria-pressed={view === id} aria-label={label} onClick={() => { setView(id); }}
                  className={cn("rounded-md p-1.5 text-faint transition-colors hover:text-fg cursor-pointer", view === id && "bg-surface-2 text-fg")}
                ><Icon className="size-3.5" /></button>
              ))}
            </div>
          ) : null}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? <Skeleton style={{ height }} className="w-full" /> : view === "table" && table ? <DataTableView {...table} height={height} /> : <div style={{ minHeight: height }}>{children}</div>}
      </CardContent>
    </Card>
  );
}

function DataTableView({ columns, rows, height }: { columns: TableColumn[]; rows: TableRow[]; height: number }): ReactElement {
  return (
    <div className="overflow-auto rounded-lg border border-border" style={{ maxHeight: height }}>
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-surface-2 text-xs text-muted">
          <tr>{columns.map((c) => <th key={c.key} scope="col" className={cn("px-3 py-2 font-medium", c.align === "right" ? "text-right" : "text-left")}>{c.header}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-border">
              {columns.map((c) => <td key={c.key} className={cn("px-3 py-1.5 tabular", c.align === "right" ? "text-right" : "text-left")}>{r[c.key]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
