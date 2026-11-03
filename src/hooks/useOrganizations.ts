import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { fetchBreakdown } from "@/https/services/analytics";
import { filterSearchSchema } from "@/lib/filters";

export type OrganizationOption = { id: number; label: string };

/** Organizations that have recent activity, used to populate the filter. */
export function useOrganizations(): UseQueryResult<OrganizationOption[]> {
  return useQuery({
    queryKey: ["organizations"],
    queryFn: async ({ signal }) => {
      const res = await fetchBreakdown(filterSearchSchema.parse({ range: "last90" }), "organization", signal);
      return res.groups.flatMap((g) => (g.id !== null && g.label !== null ? [{ id: g.id, label: g.label }] : []));
    },
    staleTime: 5 * 60_000,
  });
}
