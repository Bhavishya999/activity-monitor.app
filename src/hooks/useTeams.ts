import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { fetchTeams } from "@/https/services/teams";
import { QUERY_KEYS } from "@/lib/constants/app-constants";
import type { Team } from "@/lib/interfaces/analytics";

export function useTeams(): UseQueryResult<Team[]> {
  return useQuery({ queryKey: [QUERY_KEYS.teams], queryFn: async ({ signal }) => (await fetchTeams(signal)).items, staleTime: 5 * 60_000 });
}
