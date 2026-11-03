import type { InputHTMLAttributes, ReactElement } from "react";
import { cn } from "@/lib/cn";

export const fieldClass =
  "h-9 rounded-lg border border-border bg-surface px-3 text-sm text-fg shadow-card placeholder:text-faint focus-visible:outline-2";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>): ReactElement {
  return <input className={cn(fieldClass, "w-full", className)} {...props} />;
}
