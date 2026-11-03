import { ChevronDown } from "lucide-react";
import type { ReactElement, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { fieldClass } from "./input";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & { label: string };

/** Native select (best mobile and accessibility behaviour) with a visually hidden label. */
export function Select({ className, label, children, ...props }: SelectProps): ReactElement {
  return (
    <div className="relative">
      <label className="sr-only" htmlFor={props.id}>{label}</label>
      <select className={cn(fieldClass, "appearance-none pr-8 cursor-pointer", className)} {...props}>{children}</select>
      <ChevronDown aria-hidden className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-faint" />
    </div>
  );
}
