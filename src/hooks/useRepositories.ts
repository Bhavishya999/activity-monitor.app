import { keepPreviousData, useQuery, type UseQueryResult } from "@tanstack/react-query";
import { fetchRepositories, fetchRepository } from "@/https/services/repositories";
import { REFRESH_INTERVAL_MS, QUERY_KEYS } from "@/lib/constants/app-constants";
import { isQueryable, type FilterSearch, type PagedSearch } from "@/lib/filters";
import type { Paged, RepositoryDetailResponse, RepositoryListItem } from "@/lib/interfaces/analytics";

export function useRepositories(search: PagedSearch): UseQueryResult<Paged<RepositoryListItem>> {
  return useQuery({
    queryKey: [QUERY_KEYS.repositories, search], queryFn: ({ signal }) => fetchRepositories(search, signal),
    enabled: isQueryable(search), placeholderData: keepPreviousData, refetchInterval: REFRESH_INTERVAL_MS,
  });
}

export function useRepository(id: number, search: FilterSearch): UseQueryResult<RepositoryDetailResponse> {
  return useQuery({
    queryKey: [QUERY_KEYS.repository, id, search], queryFn: ({ signal }) => fetchRepository(id, search, signal),
    enabled: isQueryable(search), placeholderData: keepPreviousData, refetchInterval: REFRESH_INTERVAL_MS,
  });
}
