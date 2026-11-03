import type { QueryClient } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";
import { meQueryOptions } from "@/hooks/useMe";
import { isApiError } from "@/https/httpErrorHandler";
import type { MeResponse } from "@/lib/interfaces/auth";

/** beforeLoad guard: sends signed-out visitors to /login. The API still enforces access on every request. */
export async function requireSession(queryClient: QueryClient): Promise<MeResponse> {
  try {
    return await queryClient.ensureQueryData(meQueryOptions);
  } catch (error) {
    if (isApiError(error) && error.status === 401) throw redirect({ to: "/login" });
    throw error;
  }
}
