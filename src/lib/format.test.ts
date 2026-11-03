import { describe, expect, it } from "vitest";
import { formatCompact, formatHour, formatNumber, formatPercent, formatRelative, initials, NO_VALUE, shortSha } from "./format";

describe("number formatting", () => {
  it("shows -- for missing values, never 0", () => {
    expect(formatNumber(null)).toBe(NO_VALUE);
    expect(formatNumber(undefined)).toBe(NO_VALUE);
    expect(formatCompact(null)).toBe(NO_VALUE);
  });
  it("groups thousands and compacts large numbers", () => {
    expect(formatNumber(12345)).toBe("12,345");
    expect(formatCompact(1500)).toBe("1.5K");
    expect(formatCompact(12)).toBe("12");
  });
  it("does not divide by zero in percentages", () => {
    expect(formatPercent(1, 0)).toBe(NO_VALUE);
    expect(formatPercent(1, 4)).toBe("25%");
  });
});

describe("formatHour", () => {
  it.each([[0, "12 AM"], [9, "9 AM"], [12, "12 PM"], [13, "1 PM"], [23, "11 PM"]])("%i -> %s", (h, label) => {
    expect(formatHour(h)).toBe(label);
  });
});

describe("formatRelative", () => {
  const now = Date.parse("2026-11-03T12:00:00Z");
  it("describes recent and older times", () => {
    expect(formatRelative("2026-11-03T11:59:40Z", now)).toBe("just now");
    expect(formatRelative("2026-11-03T09:00:00Z", now)).toBe("3 hours ago");
    expect(formatRelative("2026-11-01T12:00:00Z", now)).toBe("2 days ago");
  });
  it("handles missing values", () => expect(formatRelative(null, now)).toBe(NO_VALUE));
});

describe("labels", () => {
  it("builds initials without sample or bot decorations", () => {
    expect(initials("sample-asha")).toBe("AS");
    expect(initials("dependabot[bot]")).toBe("DE");
  });
  it("shortens SHAs", () => expect(shortSha("0123456789abcdef")).toBe("0123456"));
});
