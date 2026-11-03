import { QueryClient } from "@tanstack/react-query";
import { ApiException } from "../https/fetch";
import { clearSession } from "./authSession";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Never retry on client errors — they won't self-resolve
        if (error instanceof ApiException && error.status < 500) {
          return false;
        }
        return failureCount < 1;
      },
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Global 401 handler: when any query or mutation gets a 401 (session expired or
 * never logged in), clear local session state and hard-navigate to /login.
 *
 * Uses window.location.replace so there is no back-button loop to the protected page.
 * The `?redirectTo=` param is read by LoginPage after a successful login.
 */
export function handle401(): void {
  clearSession();
  queryClient.clear();

  const redirectTo = window.location.pathname + window.location.search;
  const loginUrl =
    redirectTo === "/" || redirectTo === "/login"
      ? "/login"
      : `/login?redirectTo=${encodeURIComponent(redirectTo)}`;

  window.location.replace(loginUrl);
}
