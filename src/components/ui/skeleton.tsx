import type { HTMLAttributes, ReactElement } from "react";
import { cn } from "@/lib/cn";

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>): ReactElement {
  return <div aria-hidden className={cn("skeleton", className)} {...props} />;
}
