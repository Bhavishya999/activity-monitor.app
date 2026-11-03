import { keepPreviousData, useQuery, type UseQueryResult } from "@tanstack/react-query";
import { fetchBreakdown, fetchOverview } from "@/https/services/analytics";
import { REFRESH_INTERVAL_MS, QUERY_KEYS } from "@/lib/constants/app-constants";
import type { BreakdownDimension } from "@/lib/constants/filter-constants";
import { isQueryable, type FilterSearch } from "@/lib/filters";
import type { BreakdownResponse, OverviewResponse } from "@/lib/interfaces/analytics";

export function useOverview(search: FilterSearch): UseQueryResult<OverviewResponse> {
  return useQuery({
    queryKey: [QUERY_KEYS.overview, search], queryFn: ({ signal }) => fetchOverview(search, signal),
    enabled: isQueryable(search), placeholderData: keepPreviousData, refetchInterval: REFRESH_INTERVAL_MS,
  });
}

export function useBreakdown(search: FilterSearch, by: BreakdownDimension): UseQueryResult<BreakdownResponse> {
  return useQuery({
    queryKey: [QUERY_KEYS.breakdown, by, search], queryFn: ({ signal }) => fetchBreakdown(search, by, signal),
    enabled: isQueryable(search), placeholderData: keepPreviousData, refetchInterval: REFRESH_INTERVAL_MS,
  });
}
