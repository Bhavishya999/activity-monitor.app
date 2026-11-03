import type { Team } from "@/lib/interfaces/analytics";
import { apiFetch } from "../fetch";

export const fetchTeams = (signal?: AbortSignal): Promise<{ items: Team[] }> => apiFetch<{ items: Team[] }>("/teams", { signal });

export type TeamMember = { id: number; login: string; avatarUrl: string | null };

export const fetchTeam = (id: number, signal?: AbortSignal): Promise<Team & { members: TeamMember[] }> =>
  apiFetch<Team & { members: TeamMember[] }>(`/teams/${id}`, { signal });

export const createTeam = (name: string): Promise<Team> => apiFetch<Team>("/teams", { method: "POST", body: { name } });

export const setTeamMembers = (id: number, developerAccountIds: number[]): Promise<{ members: TeamMember[] }> =>
  apiFetch<{ members: TeamMember[] }>(`/teams/${id}/members`, { method: "PUT", body: { developerAccountIds } });

/** Every GitHub account that has ever committed (last year), to pick team members from. */
export async function fetchTeamCandidates(signal?: AbortSignal): Promise<TeamMember[]> {
  const res = await apiFetch<{ items: { id: number; login: string; avatarUrl: string | null }[] }>("/developers", {
    query: new URLSearchParams({ range: "custom", from: new Date(Date.now() - 365 * 86_400_000).toISOString().slice(0, 10), to: new Date().toISOString().slice(0, 10), pageSize: "100", sort: "name", includeBots: "false" }),
    signal,
  });
  return res.items.map((d) => ({ id: d.id, login: d.login, avatarUrl: d.avatarUrl }));
}
