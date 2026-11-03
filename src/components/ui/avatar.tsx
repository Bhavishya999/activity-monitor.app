import type { ReactElement } from "react";
import { cn } from "@/lib/cn";
import { initials } from "@/lib/format";

type AvatarProps = { login: string; src?: string | null | undefined; size?: "sm" | "md" | "lg"; className?: string };

const SIZES = { sm: "size-6 text-[10px]", md: "size-8 text-xs", lg: "size-14 text-lg" } as const;

/** Real GitHub avatar when we have one, otherwise a stable tinted monogram (colour derived from the login, not decoration). */
export function Avatar({ login, src, size = "md", className }: AvatarProps): ReactElement {
  const hue = [...login].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % 8;
  if (src) return <img src={src} alt="" loading="lazy" className={cn("shrink-0 rounded-full bg-surface-2", SIZES[size], className)} />;
  return (
    <span
      aria-hidden
      className={cn("inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-fg", SIZES[size], className)}
      style={{ background: `color-mix(in srgb, var(--series-${hue + 1}) 22%, var(--surface))`, boxShadow: `inset 0 0 0 1px color-mix(in srgb, var(--series-${hue + 1}) 45%, transparent)` }}
    >
      {initials(login)}
    </span>
  );
}
