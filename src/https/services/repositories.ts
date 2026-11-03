import type { Paged, RepositoryDetailResponse, RepositoryListItem } from "@/lib/interfaces/analytics";
import { toApiQuery, type FilterSearch, type PagedSearch } from "@/lib/filters";
import { PAGE_SIZES } from "@/lib/constants/app-constants";
import { apiFetch } from "../fetch";

export const fetchRepositories = (search: PagedSearch, signal?: AbortSignal): Promise<Paged<RepositoryListItem>> =>
  apiFetch<Paged<RepositoryListItem>>("/repositories", { query: toApiQuery(search, { page: search.page, pageSize: PAGE_SIZES.table, q: search.q, sort: search.sort }), signal });

export const fetchRepository = (id: number, search: FilterSearch, signal?: AbortSignal): Promise<RepositoryDetailResponse> =>
  apiFetch<RepositoryDetailResponse>(`/repositories/${id}`, { query: toApiQuery(search), signal });
