import type { CommitItem, Paged } from "@/lib/interfaces/analytics";
import { toApiQuery, type PagedSearch } from "@/lib/filters";
import { PAGE_SIZES } from "@/lib/constants/app-constants";
import { apiFetch } from "../fetch";

export const fetchCommits = (search: PagedSearch & { developerId?: number | undefined }, signal?: AbortSignal): Promise<Paged<CommitItem>> =>
  apiFetch<Paged<CommitItem>>("/commits", { query: toApiQuery(search, { page: search.page, pageSize: PAGE_SIZES.commits, q: search.q, developerId: search.developerId }), signal });
