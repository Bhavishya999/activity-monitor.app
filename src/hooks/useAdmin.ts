import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  fetchAuditLog,
  fetchSettings,
  fetchSyncRuns,
  fetchUsers,
  triggerSync,
  updateSetting,
  updateUser,
} from "../https/services/admin";
import { fetchGitHubAccounts } from "../https/services/github";
import type { RoleName } from "../lib/interfaces/admin";

const STALE = 30_000;

export function useGitHubAccounts() {
  return useQuery({
    queryKey: ["github-accounts"],
    queryFn: fetchGitHubAccounts,
    staleTime: STALE,
  });
}

export function useSyncRuns(params: { page?: number; pageSize?: number; installationId?: number }) {
  return useQuery({
    queryKey: ["sync-runs", params],
    queryFn: () => fetchSyncRuns(params),
    staleTime: STALE,
    placeholderData: (prev) => prev,
  });
}

export function useTriggerSync() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (installationId: number) => triggerSync(installationId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["sync-runs"] });
      toast.success("Sync triggered", { description: "Commits are being imported in the background." });
    },
    onError: (err: Error) => {
      toast.error("Sync failed", { description: err.message });
    },
  });
}

export function useAdminUsers(params: { page?: number; pageSize?: number; search?: string }) {
  return useQuery({
    queryKey: ["admin-users", params],
    queryFn: () => fetchUsers(params),
    staleTime: STALE,
    placeholderData: (prev) => prev,
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { role?: RoleName; active?: boolean } }) =>
      updateUser(id, data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User updated");
    },
    onError: (err: Error) => {
      toast.error("Update failed", { description: err.message });
    },
  });
}

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
    staleTime: STALE,
  });
}

export function useUpdateSetting() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: unknown }) => updateSetting(key, value),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Setting saved");
    },
    onError: (err: Error) => {
      toast.error("Failed to save setting", { description: err.message });
    },
  });
}

export function useAuditLog(params: { page?: number; pageSize?: number }) {
  return useQuery({
    queryKey: ["audit-log", params],
    queryFn: () => fetchAuditLog(params),
    staleTime: STALE,
    placeholderData: (prev) => prev,
  });
}
