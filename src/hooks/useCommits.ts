import { keepPreviousData, useQuery, type UseQueryResult } from "@tanstack/react-query";
import { fetchCommits } from "@/https/services/commits";
import { REFRESH_INTERVAL_MS, QUERY_KEYS } from "@/lib/constants/app-constants";
import { isQueryable, type PagedSearch } from "@/lib/filters";
import type { CommitItem, Paged } from "@/lib/interfaces/analytics";

export function useCommits(search: PagedSearch & { developerId?: number | undefined }): UseQueryResult<Paged<CommitItem>> {
  return useQuery({
    queryKey: [QUERY_KEYS.commits, search], queryFn: ({ signal }) => fetchCommits(search, signal),
    enabled: isQueryable(search), placeholderData: keepPreviousData, refetchInterval: REFRESH_INTERVAL_MS,
  });
}
