import { apiFetch } from "../fetch";
import type { AnalyticsFilter, CommitsResponse, DeveloperDetailResponse, DevelopersResponse, OverviewResponse, RepositoriesResponse, RepositoryDetailResponse } from "../../lib/interfaces/analytics";

function toQuery(filter: AnalyticsFilter & Record<string, unknown>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filter)) {
    if (value !== undefined && value !== null) {
      params.set(key, String(value));
    }
  }
  const q = params.toString();
  return q ? `?${q}` : "";
}

export async function fetchOverview(filter: AnalyticsFilter): Promise<OverviewResponse> {
  return apiFetch<OverviewResponse>(`/overview${toQuery(filter)}`);
}

export async function fetchDevelopers(
  filter: AnalyticsFilter & { page?: number; pageSize?: number },
): Promise<DevelopersResponse> {
  return apiFetch<DevelopersResponse>(`/developers${toQuery(filter)}`);
}

export async function fetchDeveloperDetail(
  id: number,
  filter: AnalyticsFilter,
): Promise<DeveloperDetailResponse> {
  return apiFetch<DeveloperDetailResponse>(`/developers/${id}${toQuery(filter)}`);
}

export async function fetchRepositories(
  filter: AnalyticsFilter & { page?: number; pageSize?: number },
): Promise<RepositoriesResponse> {
  return apiFetch<RepositoriesResponse>(`/repositories${toQuery(filter)}`);
}

export async function fetchRepositoryDetail(
  id: number,
  filter: AnalyticsFilter,
): Promise<RepositoryDetailResponse> {
  return apiFetch<RepositoryDetailResponse>(`/repositories/${id}${toQuery(filter)}`);
}

export async function fetchCommits(
  filter: AnalyticsFilter & { page?: number; pageSize?: number; repoId?: number; developerId?: number },
): Promise<CommitsResponse> {
  return apiFetch<CommitsResponse>(`/commits${toQuery(filter)}`);
}
