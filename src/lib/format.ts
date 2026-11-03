const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
const full = new Intl.NumberFormat("en");

export const NO_VALUE = "--";

export function formatNumber(value: number | null | undefined): string {
  return value === null || value === undefined ? NO_VALUE : full.format(value);
}

/** 1.2K style for tiles and axes where space is tight; full numbers stay in tooltips. */
export function formatCompact(value: number | null | undefined): string {
  return value === null || value === undefined ? NO_VALUE : compact.format(value);
}

export function formatPercent(part: number, total: number): string {
  return total === 0 ? NO_VALUE : `${Math.round((part / total) * 100)}%`;
}

/** 0 -> "12 AM", 13 -> "1 PM" */
export function formatHour(hour: number): string {
  const suffix = hour < 12 ? "AM" : "PM";
  const h = hour % 12 === 0 ? 12 : hour % 12;
  return `${h} ${suffix}`;
}

export function formatDay(day: string): string {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(`${day}T00:00:00Z`));
}

export function formatWeekday(day: string): string {
  return new Intl.DateTimeFormat("en", { weekday: "short", timeZone: "UTC" }).format(new Date(`${day}T00:00:00Z`));
}

export function formatDateTime(iso: string | null | undefined, timeZone: string): string {
  if (!iso) return NO_VALUE;
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone }).format(new Date(iso));
}

export function formatDate(iso: string | null | undefined, timeZone: string): string {
  if (!iso) return NO_VALUE;
  return new Intl.DateTimeFormat("en", { year: "numeric", month: "short", day: "numeric", timeZone }).format(new Date(iso));
}

const UNITS: readonly [Intl.RelativeTimeFormatUnit, number][] = [["day", 86_400_000], ["hour", 3_600_000], ["minute", 60_000]];

export function formatRelative(iso: string | null | undefined, now: number = Date.now()): string {
  if (!iso) return NO_VALUE;
  const diff = new Date(iso).getTime() - now;
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  for (const [unit, ms] of UNITS) if (Math.abs(diff) >= ms) return rtf.format(Math.round(diff / ms), unit);
  return "just now";
}

export function initials(login: string): string {
  const cleaned = login.replace(/^sample-/, "").replace(/\[bot\]$/, "");
  return cleaned.slice(0, 2).toUpperCase();
}

export function shortSha(sha: string): string {
  return sha.slice(0, 7);
}

export function timezoneLabel(timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en", { timeZone, timeZoneName: "short" }).formatToParts(new Date());
  return parts.find((p) => p.type === "timeZoneName")?.value ?? timeZone;
}
