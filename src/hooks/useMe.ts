import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { fetchMe } from "@/https/services/auth";
import { setCsrfToken } from "@/lib/authSession";
import { QUERY_KEYS } from "@/lib/constants/app-constants";
import type { MeResponse } from "@/lib/interfaces/auth";

export const meQueryOptions = {
  queryKey: QUERY_KEYS.me,
  queryFn: async ({ signal }: { signal: AbortSignal }): Promise<MeResponse> => {
    const me = await fetchMe(signal);
    setCsrfToken(me.csrfToken);
    return me;
  },
  staleTime: 5 * 60_000,
  retry: false,
} as const;

export function useMe(): UseQueryResult<MeResponse> {
  return useQuery(meQueryOptions);
}
