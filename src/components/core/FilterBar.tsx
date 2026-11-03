import { useCallback } from "react";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

export type FilterValues = {
  dateFrom: string;
  dateTo: string;
  includeMerges: boolean;
  includeBots: boolean;
};

type FilterBarProps = {
  value: FilterValues;
  onChange: (next: FilterValues) => void;
};

export function FilterBar({ value, onChange }: FilterBarProps) {
  const set = useCallback(
    <K extends keyof FilterValues>(key: K, val: FilterValues[K]) =>
      onChange({ ...value, [key]: val }),
    [onChange, value],
  );

  const setDateFrom = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => set("dateFrom", e.target.value),
    [set],
  );

  const setDateTo = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => set("dateTo", e.target.value),
    [set],
  );

  const setIncludeMerges = useCallback(
    (v: boolean) => set("includeMerges", v),
    [set],
  );

  const setIncludeBots = useCallback(
    (v: boolean) => set("includeBots", v),
    [set],
  );

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-border bg-card px-4 py-3">
      <div className="flex items-center gap-2">
        <Label htmlFor="dateFrom" className="shrink-0 text-xs">From</Label>
        <Input
          id="dateFrom"
          type="date"
          value={value.dateFrom}
          onChange={setDateFrom}
          className="h-8 w-36 text-xs"
        />
      </div>

      <div className="flex items-center gap-2">
        <Label htmlFor="dateTo" className="shrink-0 text-xs">To</Label>
        <Input
          id="dateTo"
          type="date"
          value={value.dateTo}
          onChange={setDateTo}
          className="h-8 w-36 text-xs"
        />
      </div>

      <div className="mx-1 h-4 w-px bg-border" />

      <div className="flex items-center gap-2">
        <Switch
          id="includeMerges"
          checked={value.includeMerges}
          onCheckedChange={setIncludeMerges}
        />
        <Label htmlFor="includeMerges" className="cursor-pointer text-xs">Include merges</Label>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          id="includeBots"
          checked={value.includeBots}
          onCheckedChange={setIncludeBots}
        />
        <Label htmlFor="includeBots" className="cursor-pointer text-xs">Include bots</Label>
      </div>
    </div>
  );
}
