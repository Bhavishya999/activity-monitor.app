import { AlertCircle } from "lucide-react";
import { Button } from "../ui/button";
import { ApiException } from "../../https/fetch";

type ErrorStateProps = {
  message?: string | undefined;
  error?: Error | null | undefined;
  onRetry?: (() => void) | undefined;
};

export function ErrorState({ message, error, onRetry }: ErrorStateProps) {
  const displayMessage =
    message ??
    (error instanceof ApiException ? error.message : undefined) ??
    error?.message ??
    "Something went wrong";

  const requestId = error instanceof ApiException ? error.requestId : undefined;

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="h-5 w-5 text-destructive" aria-hidden />
      </div>
      <p className="mt-3 text-sm font-semibold">{displayMessage}</p>
      {requestId && (
        <p className="mt-1 font-mono text-[10px] text-muted-foreground">
          Request ID: {requestId}
        </p>
      )}
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
