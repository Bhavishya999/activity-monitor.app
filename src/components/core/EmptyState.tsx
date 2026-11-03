import type { LucideIcon } from "lucide-react";
import type { ReactElement, ReactNode } from "react";

type EmptyStateProps = { icon: LucideIcon; title: string; description: string; action?: ReactNode };

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps): ReactElement {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border-strong bg-surface px-6 py-14 text-center">
      <span className="rounded-xl bg-accent-soft p-3 text-accent-strong"><Icon aria-hidden className="size-6" /></span>
      <h2 className="mt-4 text-base font-semibold text-fg">{title}</h2>
      <p className="mt-1 max-w-md text-sm text-muted">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
