export const API_BASE = import.meta.env.VITE_API_URL ?? "";
export const API_PREFIX = "/api/v1";

export const CSRF_HEADER = "x-csrf-token";

/** Data refreshes in the background so dashboards follow GitHub activity without a manual reload. */
export const REFRESH_INTERVAL_MS = 60_000;

export const THEME_STORAGE_KEY = "gam-theme";

export const QUERY_KEYS = {
  me: ["me"],
  meta: ["meta"],
  overview: "overview",
  breakdown: "breakdown",
  developers: "developers",
  developer: "developer",
  repositories: "repositories",
  repository: "repository",
  commits: "commits",
  teams: "teams",
} as const;

export const PAGE_SIZES = { table: 25, commits: 30 } as const;
