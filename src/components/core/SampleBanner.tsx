import { FlaskConical } from "lucide-react";
import type { ReactElement } from "react";
import { useMeta } from "@/hooks/useMeta";

/** Shown permanently whenever the API says the database holds demo data, so it can never pass for real numbers. */
export function SampleBanner(): ReactElement | null {
  const { data } = useMeta();
  if (!data?.sample) return null;
  return (
    <div role="status" className="flex items-center justify-center gap-2 border-b border-border bg-[color-mix(in_srgb,var(--warning)_24%,var(--surface))] px-4 py-1.5 text-xs font-medium text-fg">
      <FlaskConical aria-hidden className="size-3.5" />
      SAMPLE DATA: this environment shows demo numbers, not real GitHub activity.
    </div>
  );
}
