import { useQuery } from "@tanstack/react-query";
import {
  fetchCommits,
  fetchDeveloperDetail,
  fetchDevelopers,
  fetchOverview,
  fetchRepositories,
  fetchRepositoryDetail,
} from "../https/services/analytics";
import type { AnalyticsFilter } from "../lib/interfaces/analytics";

const STALE = 60_000; // 1 min

export type PaginatedFilter = AnalyticsFilter & { page?: number; pageSize?: number };

export function useOverview(filter: AnalyticsFilter) {
  return useQuery({
    queryKey: ["overview", filter],
    queryFn: () => fetchOverview(filter),
    staleTime: STALE,
  });
}

export function useDevelopers(filter: PaginatedFilter) {
  return useQuery({
    queryKey: ["developers", filter],
    queryFn: () => fetchDevelopers(filter),
    staleTime: STALE,
    placeholderData: (prev) => prev,
  });
}

export function useDeveloperDetail(id: number, filter: AnalyticsFilter) {
  return useQuery({
    queryKey: ["developer", id, filter],
    queryFn: () => fetchDeveloperDetail(id, filter),
    staleTime: STALE,
    enabled: id > 0,
  });
}

export function useRepositories(filter: PaginatedFilter) {
  return useQuery({
    queryKey: ["repositories", filter],
    queryFn: () => fetchRepositories(filter),
    staleTime: STALE,
    placeholderData: (prev) => prev,
  });
}

export function useRepositoryDetail(id: number, filter: AnalyticsFilter) {
  return useQuery({
    queryKey: ["repository", id, filter],
    queryFn: () => fetchRepositoryDetail(id, filter),
    staleTime: STALE,
    enabled: id > 0,
  });
}

export function useCommits(filter: PaginatedFilter & { repoId?: number; developerId?: number }) {
  return useQuery({
    queryKey: ["commits", filter],
    queryFn: () => fetchCommits(filter),
    staleTime: STALE,
    placeholderData: (prev) => prev,
  });
}
