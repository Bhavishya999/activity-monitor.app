import { useMeta } from "./useMeta";

const FALLBACK_TIMEZONE = "Asia/Kolkata";

/** The reporting timezone from the API, with a safe default while it loads. */
export function useAnalyticsMeta(): { timezone: string } {
  const { data } = useMeta();
  return { timezone: data?.timezone ?? FALLBACK_TIMEZONE };
}
