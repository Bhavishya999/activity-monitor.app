import { RotateCcw } from "lucide-react";
import type { ReactElement } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/cn";
import { useFilters } from "@/hooks/useFilters";
import { useOrganizations } from "@/hooks/useOrganizations";
import { useTeams } from "@/hooks/useTeams";
import { DEFAULT_RANGE, RANGE_LABELS, RANGE_PRESETS } from "@/lib/constants/filter-constants";

type FilterBarProps = { showTeam?: boolean; showOrganization?: boolean; showToggles?: boolean };

function Toggle({ label, pressed, onChange }: { label: string; pressed: boolean; onChange: (next: boolean) => void }): ReactElement {
  return (
    <button
      type="button" role="switch" aria-checked={pressed} onClick={() => { onChange(!pressed); }}
      className={cn("inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm cursor-pointer transition-colors", pressed ? "border-accent bg-accent-soft text-accent-strong" : "border-border bg-surface text-muted hover:bg-surface-2")}
    >
      <span aria-hidden className={cn("size-2 rounded-full", pressed ? "bg-accent" : "bg-border-strong")} />{label}
    </button>
  );
}

/** All filters read and write the URL, so a filtered view can be shared as a link. */
export function FilterBar({ showTeam = true, showOrganization = true, showToggles = true }: FilterBarProps): ReactElement {
  const { search, update, reset } = useFilters();
  const teams = useTeams();
  const organizations = useOrganizations();
  const isDefault = search.range === DEFAULT_RANGE && !search.teamId && !search.installationId && search.includeBots === undefined && search.includeMerges === undefined;

  return (
    <div className="mb-5 flex flex-wrap items-center gap-2" role="search" aria-label="Filters">
      <Select id="f-range" label="Date range" value={search.range} onChange={(e) => { update({ range: RANGE_PRESETS.find((p) => p === e.target.value) ?? DEFAULT_RANGE }); }}>
        {RANGE_PRESETS.map((p) => <option key={p} value={p}>{RANGE_LABELS[p]}</option>)}
      </Select>
      {search.range === "custom" ? (
        <>
          <Input id="f-from" aria-label="From date" type="date" className="w-40" value={search.from ?? ""} max={search.to} onChange={(e) => { update({ from: e.target.value || undefined }); }} />
          <span className="text-faint">to</span>
          <Input id="f-to" aria-label="To date" type="date" className="w-40" value={search.to ?? ""} min={search.from} onChange={(e) => { update({ to: e.target.value || undefined }); }} />
        </>
      ) : null}
      {showTeam && (teams.data?.length ?? 0) > 0 ? (
        <Select id="f-team" label="Team" value={search.teamId ?? ""} onChange={(e) => { update({ teamId: e.target.value ? Number(e.target.value) : undefined }); }}>
          <option value="">All teams</option>
          {teams.data?.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </Select>
      ) : null}
      {showOrganization && (organizations.data?.length ?? 0) > 1 ? (
        <Select id="f-org" label="GitHub organization" value={search.installationId ?? ""} onChange={(e) => { update({ installationId: e.target.value ? Number(e.target.value) : undefined }); }}>
          <option value="">All organizations</option>
          {organizations.data?.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
        </Select>
      ) : null}
      {showToggles ? (
        <>
          <Toggle label="Bots" pressed={search.includeBots ?? false} onChange={(next) => { update({ includeBots: next ? true : undefined }); }} />
          <Toggle label="Merge commits" pressed={search.includeMerges ?? true} onChange={(next) => { update({ includeMerges: next ? undefined : false }); }} />
        </>
      ) : null}
      {!isDefault ? <Button variant="ghost" size="sm" onClick={reset}><RotateCcw aria-hidden className="size-3.5" />Reset</Button> : null}
    </div>
  );
}
