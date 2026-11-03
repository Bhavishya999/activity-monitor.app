import { useNavigate, useSearch } from "@tanstack/react-router";
import { useCallback } from "react";
import { pagedSearchSchema, type PagedSearch } from "@/lib/filters";

/** Reads filter state from the URL (validated, with safe fallbacks) and writes changes back to it. */
export function useFilters(): { search: PagedSearch; update: (patch: Partial<PagedSearch>) => void; reset: () => void } {
  const raw = useSearch({ strict: false });
  const navigate = useNavigate();
  const search = pagedSearchSchema.parse(raw);

  const update = useCallback((patch: Partial<PagedSearch>) => {
    void navigate({ to: ".", search: (prev) => ({ ...prev, ...patch, page: patch.page ?? 1 }) });
  }, [navigate]);

  const reset = useCallback(() => {
    void navigate({ to: ".", search: {} });
  }, [navigate]);

  return { search, update, reset };
}
