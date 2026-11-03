import { QueryClient } from "@tanstack/react-query";
import { isApiError } from "@/https/httpErrorHandler";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: true,
      // Auth and validation errors will not fix themselves; only retry network and server failures.
      retry: (failureCount, error) => (!isApiError(error) || error.status >= 500) && failureCount < 2,
    },
  },
});
