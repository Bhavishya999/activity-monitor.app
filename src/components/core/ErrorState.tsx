import { AlertTriangle, RotateCw } from "lucide-react";
import type { ReactElement } from "react";
import { Button } from "@/components/ui/button";
import { errorMessage, isApiError } from "@/https/httpErrorHandler";

type ErrorStateProps = { error: unknown; onRetry?: () => void };

export function ErrorState({ error, onRetry }: ErrorStateProps): ReactElement {
  const requestId = isApiError(error) ? error.requestId : null;
  return (
    <div role="alert" className="flex flex-col items-center rounded-xl border border-border bg-surface px-6 py-12 text-center">
      <span className="rounded-xl bg-[color-mix(in_srgb,var(--critical)_14%,transparent)] p-3"><AlertTriangle aria-hidden className="size-6" style={{ color: "var(--critical)" }} /></span>
      <h2 className="mt-4 text-base font-semibold text-fg">We could not load this</h2>
      <p className="mt-1 max-w-md text-sm text-muted">{errorMessage(error)}</p>
      {requestId ? <p className="mt-2 text-xs text-faint">Reference: <code className="rounded bg-surface-2 px-1.5 py-0.5">{requestId}</code></p> : null}
      {onRetry ? <Button className="mt-5" onClick={onRetry}><RotateCw aria-hidden className="size-4" />Try again</Button> : null}
    </div>
  );
}
