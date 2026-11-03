import type { BreakdownResponse, OverviewResponse } from "@/lib/interfaces/analytics";
import type { BreakdownDimension } from "@/lib/constants/filter-constants";
import { toApiQuery, type FilterSearch } from "@/lib/filters";
import { apiFetch } from "../fetch";

export const fetchOverview = (search: FilterSearch, signal?: AbortSignal): Promise<OverviewResponse> =>
  apiFetch<OverviewResponse>("/analytics/overview", { query: toApiQuery(search), signal });

export const fetchBreakdown = (search: FilterSearch, by: BreakdownDimension, signal?: AbortSignal): Promise<BreakdownResponse> =>
  apiFetch<BreakdownResponse>("/analytics/breakdown", { query: toApiQuery(search, { by, limit: 100 }), signal });
