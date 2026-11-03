import type { HTMLAttributes, ReactElement } from "react";
import { cn } from "@/lib/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>): ReactElement {
  return <div className={cn("min-w-0 rounded-xl border border-border bg-surface shadow-card", className)} {...props} />;
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>): ReactElement {
  return <div className={cn("flex items-start justify-between gap-3 px-5 pt-4", className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>): ReactElement {
  return <h3 className={cn("text-sm font-semibold text-fg", className)} {...props} />;
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>): ReactElement {
  return <p className={cn("mt-0.5 text-xs text-faint", className)} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>): ReactElement {
  return <div className={cn("px-5 pb-5 pt-3", className)} {...props} />;
}
