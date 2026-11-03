import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { fetchMeta } from "@/https/services/auth";
import { QUERY_KEYS } from "@/lib/constants/app-constants";
import type { AppMeta } from "@/lib/interfaces/auth";

export function useMeta(): UseQueryResult<AppMeta> {
  return useQuery({ queryKey: QUERY_KEYS.meta, queryFn: ({ signal }) => fetchMeta(signal), staleTime: 10 * 60_000 });
}
