import type { ReactElement, ReactNode } from "react";

type PageHeaderProps = { title: string; description?: string | undefined; actions?: ReactNode; leading?: ReactNode };

export function PageHeader({ title, description, actions, leading }: PageHeaderProps): ReactElement {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div className="flex min-w-0 items-center gap-4">
        {leading}
        <div className="min-w-0">
          <h1 className="truncate text-xl font-semibold tracking-tight text-fg sm:text-2xl">{title}</h1>
          {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
        </div>
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}
