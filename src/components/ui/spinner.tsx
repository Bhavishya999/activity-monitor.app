import { Loader2 } from "lucide-react";
import type { ReactElement } from "react";
import { cn } from "@/lib/cn";

export function Spinner({ className }: { className?: string }): ReactElement {
  return <Loader2 role="status" aria-label="Loading" className={cn("size-4 animate-spin text-faint", className)} />;
}
