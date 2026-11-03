import type { DeveloperDetailResponse, DeveloperListItem, Paged } from "@/lib/interfaces/analytics";
import { toApiQuery, type FilterSearch, type PagedSearch } from "@/lib/filters";
import { PAGE_SIZES } from "@/lib/constants/app-constants";
import { apiFetch } from "../fetch";

export const fetchDevelopers = (search: PagedSearch, signal?: AbortSignal): Promise<Paged<DeveloperListItem>> =>
  apiFetch<Paged<DeveloperListItem>>("/developers", { query: toApiQuery(search, { page: search.page, pageSize: PAGE_SIZES.table, q: search.q, sort: search.sort }), signal });

export const fetchDeveloper = (id: number, search: FilterSearch, signal?: AbortSignal): Promise<DeveloperDetailResponse> =>
  apiFetch<DeveloperDetailResponse>(`/developers/${id}`, { query: toApiQuery(search), signal });
