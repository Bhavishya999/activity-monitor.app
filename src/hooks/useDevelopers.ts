import { keepPreviousData, useQuery, type UseQueryResult } from "@tanstack/react-query";
import { fetchDeveloper, fetchDevelopers } from "@/https/services/developers";
import { REFRESH_INTERVAL_MS, QUERY_KEYS } from "@/lib/constants/app-constants";
import { isQueryable, type FilterSearch, type PagedSearch } from "@/lib/filters";
import type { DeveloperDetailResponse, DeveloperListItem, Paged } from "@/lib/interfaces/analytics";

export function useDevelopers(search: PagedSearch): UseQueryResult<Paged<DeveloperListItem>> {
  return useQuery({
    queryKey: [QUERY_KEYS.developers, search], queryFn: ({ signal }) => fetchDevelopers(search, signal),
    enabled: isQueryable(search), placeholderData: keepPreviousData, refetchInterval: REFRESH_INTERVAL_MS,
  });
}

export function useDeveloper(id: number, search: FilterSearch): UseQueryResult<DeveloperDetailResponse> {
  return useQuery({
    queryKey: [QUERY_KEYS.developer, id, search], queryFn: ({ signal }) => fetchDeveloper(id, search, signal),
    enabled: isQueryable(search), placeholderData: keepPreviousData, refetchInterval: REFRESH_INTERVAL_MS,
  });
}
