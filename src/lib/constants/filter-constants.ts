export const RANGE_PRESETS = ["today", "yesterday", "last7", "last30", "last90", "custom"] as const;
export type RangePreset = (typeof RANGE_PRESETS)[number];

export const RANGE_LABELS = {
  today: "Today", yesterday: "Yesterday", last7: "Last 7 days", last30: "Last 30 days", last90: "Last 90 days", custom: "Custom range",
} as const satisfies Record<RangePreset, string>;

export const BREAKDOWN_DIMENSIONS = ["organization", "repository", "developer", "team"] as const;
export type BreakdownDimension = (typeof BREAKDOWN_DIMENSIONS)[number];

export const BREAKDOWN_LABELS = {
  organization: "GitHub organization", repository: "Repository", developer: "Developer", team: "Team",
} as const satisfies Record<BreakdownDimension, string>;

export const DEFAULT_RANGE: RangePreset = "last30";
