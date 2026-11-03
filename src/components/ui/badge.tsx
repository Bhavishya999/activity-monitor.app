import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes, ReactElement } from "react";
import { cn } from "@/lib/cn";

const badgeVariants = cva("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium", {
  variants: {
    tone: {
      neutral: "bg-surface-2 text-muted",
      accent: "bg-accent-soft text-accent-strong",
      good: "bg-[color-mix(in_srgb,var(--good)_16%,transparent)] text-fg",
      warning: "bg-[color-mix(in_srgb,var(--warning)_22%,transparent)] text-fg",
      critical: "bg-[color-mix(in_srgb,var(--critical)_16%,transparent)] text-fg",
    },
  },
  defaultVariants: { tone: "neutral" },
});

type BadgeProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>;

export function Badge({ className, tone, ...props }: BadgeProps): ReactElement {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
