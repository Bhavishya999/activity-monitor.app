import { z } from "zod";
import { BREAKDOWN_DIMENSIONS, DEFAULT_RANGE, RANGE_PRESETS } from "./constants/filter-constants";

/** Filter state lives in the URL so any view can be shared or bookmarked and survives a refresh. */
export const filterSearchSchema = z.object({
  range: z.enum(RANGE_PRESETS).catch(DEFAULT_RANGE).default(DEFAULT_RANGE),
  from: z.iso.date().optional().catch(undefined),
  to: z.iso.date().optional().catch(undefined),
  teamId: z.coerce.number().int().positive().optional().catch(undefined),
  installationId: z.coerce.number().int().positive().optional().catch(undefined),
  repositoryId: z.coerce.number().int().positive().optional().catch(undefined),
  includeBots: z.boolean().optional().catch(undefined),
  includeMerges: z.boolean().optional().catch(undefined),
});
export type FilterSearch = z.infer<typeof filterSearchSchema>;

export const pagedSearchSchema = filterSearchSchema.extend({
  page: z.coerce.number().int().min(1).default(1).catch(1),
  q: z.string().trim().max(100).optional().catch(undefined),
  sort: z.enum(["commits", "latest", "name"]).default("commits").catch("commits"),
});
export type PagedSearch = z.infer<typeof pagedSearchSchema>;

export const analyticsSearchSchema = filterSearchSchema.extend({
  by: z.enum(BREAKDOWN_DIMENSIONS).default("organization").catch("organization"),
});
export type AnalyticsSearch = z.infer<typeof analyticsSearchSchema>;

type Primitive = string | number | boolean | undefined;

/** API query string for a filter set: omits unset values and only sends dates for custom ranges. */
export function toApiQuery(search: FilterSearch, extra: Record<string, Primitive> = {}): URLSearchParams {
  const params = new URLSearchParams();
  const put = (key: string, value: Primitive): void => { if (value !== undefined && value !== "") params.set(key, String(value)); };
  put("range", search.range);
  if (search.range === "custom") { put("from", search.from); put("to", search.to); }
  put("teamId", search.teamId);
  put("installationId", search.installationId);
  put("repositoryId", search.repositoryId);
  put("includeBots", search.includeBots);
  put("includeMerges", search.includeMerges);
  for (const [key, value] of Object.entries(extra)) put(key, value);
  return params;
}

/** A custom range is only queryable once both dates are chosen. */
export function isQueryable(search: FilterSearch): boolean {
  return search.range !== "custom" || (search.from !== undefined && search.to !== undefined && search.from <= search.to);
}
