import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Plus, UsersRound } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState, type FormEvent, type ReactElement } from "react";
import { EmptyState } from "@/components/core/EmptyState";
import { ErrorState } from "@/components/core/ErrorState";
import { PageHeader } from "@/components/core/PageHeader";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { errorMessage } from "@/https/httpErrorHandler";
import { createTeam, fetchTeam, fetchTeamCandidates, setTeamMembers } from "@/https/services/teams";
import { useMe } from "@/hooks/useMe";
import { useTeams } from "@/hooks/useTeams";
import { QUERY_KEYS } from "@/lib/constants/app-constants";
import { cn } from "@/lib/cn";
import { filterSearchSchema } from "@/lib/filters";
import type { Team } from "@/lib/interfaces/analytics";

export default function TeamsPage(): ReactElement {
  const { data: me } = useMe();
  const canManage = me?.user.role === "ADMIN" || me?.user.role === "SUPER_ADMIN";
  const { data, isLoading, isError, error, refetch } = useTeams();
  const [editing, setEditing] = useState<number | null>(null);

  return (
    <>
      <PageHeader title="Teams" description="Group GitHub accounts to see any slice of the organization" />
      {canManage ? <NewTeamForm /> : null}
      {isError ? <ErrorState error={error} onRetry={() => { void refetch(); }} /> : !isLoading && data?.length === 0 ? (
        <EmptyState icon={UsersRound} title="No teams yet" description={canManage ? "Create a team above, then choose its members. Every dashboard can then be filtered to that team." : "An admin can create teams so dashboards can be filtered by team."} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {isLoading ? Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-36" />) : data?.map((t) => (
            <TeamCard key={t.id} team={t} canManage={canManage} isEditing={editing === t.id} onToggleEdit={() => { setEditing(editing === t.id ? null : t.id); }} />
          ))}
        </div>
      )}
    </>
  );
}

function TeamCard({ team, canManage, isEditing, onToggleEdit }: { team: Team; canManage: boolean; isEditing: boolean; onToggleEdit: () => void }): ReactElement {
  return (
    <Card className={cn("rise p-5", isEditing && "md:col-span-2 xl:col-span-3")}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span aria-hidden className="size-3 shrink-0 rounded-full" style={{ background: team.color ?? "var(--series-other)" }} />
          <div className="min-w-0"><h2 className="truncate text-base font-semibold">{team.name}</h2><p className="text-xs text-faint">{team.memberCount} {team.memberCount === 1 ? "member" : "members"}</p></div>
        </div>
        <div className="flex gap-2">
          <Link to="/overview" search={filterSearchSchema.parse({ teamId: team.id })} className="inline-flex h-8 items-center rounded-lg border border-border bg-surface px-3 text-sm shadow-card hover:bg-surface-2">View activity</Link>
          {canManage ? <Button size="sm" onClick={onToggleEdit}>{isEditing ? "Close" : "Manage members"}</Button> : null}
        </div>
      </div>
      {team.description ? <p className="mt-3 text-sm text-muted">{team.description}</p> : null}
      {isEditing ? <MemberEditor teamId={team.id} onDone={onToggleEdit} /> : null}
    </Card>
  );
}

function NewTeamForm(): ReactElement {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const mutation = useMutation({
    mutationFn: () => createTeam(name.trim()),
    onSuccess: async () => { setName(""); await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.teams] }); },
  });
  function onSubmit(e: FormEvent): void { e.preventDefault(); if (name.trim().length >= 2) mutation.mutate(); }
  return (
    <form onSubmit={onSubmit} className="mb-5 flex flex-wrap items-center gap-2">
      <Input aria-label="New team name" className="w-64" placeholder="New team name, e.g. Backend" value={name} onChange={(e) => { setName(e.target.value); }} maxLength={60} />
      <Button variant="primary" type="submit" disabled={name.trim().length < 2 || mutation.isPending}><Plus aria-hidden className="size-4" />Create team</Button>
      {mutation.isError ? <span role="alert" className="text-sm" style={{ color: "var(--critical)" }}>{errorMessage(mutation.error)}</span> : null}
    </form>
  );
}

function MemberEditor({ teamId, onDone }: { teamId: number; onDone: () => void }): ReactElement {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState<Set<number> | null>(null);
  const current = useQuery({ queryKey: ["team", teamId], queryFn: ({ signal }) => fetchTeam(teamId, signal) });
  const candidates = useQuery({ queryKey: ["team-candidates"], queryFn: ({ signal }) => fetchTeamCandidates(signal), staleTime: 60_000 });
  const chosen = selected ?? new Set(current.data?.members.map((m) => m.id) ?? []);
  const save = useMutation({
    mutationFn: () => setTeamMembers(teamId, [...chosen]),
    onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.teams] }); await queryClient.invalidateQueries({ queryKey: ["team", teamId] }); onDone(); },
  });
  const shown = (candidates.data ?? []).filter((c) => c.login.toLowerCase().includes(filter.toLowerCase()));

  function toggle(id: number): void {
    const next = new Set(chosen);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  }

  return (
    <div className="mt-4 border-t border-border pt-4">
      <Input aria-label="Filter accounts" placeholder="Filter GitHub accounts" value={filter} onChange={(e) => { setFilter(e.target.value); }} className="mb-3 max-w-xs" />
      {current.isLoading || candidates.isLoading ? <Skeleton className="h-32 w-full" /> : (
        <ul className="grid max-h-72 gap-1 overflow-auto sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((c) => {
            const on = chosen.has(c.id);
            return (
              <li key={c.id}>
                <button type="button" role="checkbox" aria-checked={on} onClick={() => { toggle(c.id); }}
                  className={cn("flex w-full items-center gap-2.5 rounded-lg border px-2.5 py-2 text-left text-sm cursor-pointer", on ? "border-accent bg-accent-soft" : "border-border hover:bg-surface-2")}>
                  <Avatar login={c.login} src={c.avatarUrl} size="sm" /><span className="min-w-0 flex-1 truncate">{c.login}</span>{on ? <Check aria-hidden className="size-4 text-accent-strong" /> : null}
                </button>
              </li>
            );
          })}
        </ul>
      )}
      <div className="mt-4 flex items-center gap-3">
        <Button variant="primary" onClick={() => { save.mutate(); }} disabled={save.isPending}>Save members ({chosen.size})</Button>
        <Button variant="ghost" onClick={onDone}>Cancel</Button>
        {save.isError ? <span role="alert" className="text-sm" style={{ color: "var(--critical)" }}>{errorMessage(save.error)}</span> : null}
      </div>
    </div>
  );
}
