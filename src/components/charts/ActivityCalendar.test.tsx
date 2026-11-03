import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ActivityCalendar, levelFor, quantileThresholds } from "./ActivityCalendar";

describe("calendar levels", () => {
  it("keeps zero as its own level", () => expect(levelFor(0, [1, 2, 3, 4])).toBe(0));
  it("buckets non-zero days into levels 1 to 5", () => {
    const t = quantileThresholds([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(levelFor(1, t)).toBe(1);
    expect(levelFor(10, t)).toBe(5);
  });
  it("one huge day does not flatten the rest", () => {
    const t = quantileThresholds([1, 1, 2, 2, 3, 3, 4, 4, 500]);
    expect(levelFor(3, t)).toBeGreaterThan(1);
  });
  it("has sane thresholds with no data", () => expect(quantileThresholds([0, 0])).toEqual([1, 2, 3, 4]));
});

describe("ActivityCalendar", () => {
  it("renders one labelled cell per day", () => {
    const data = Array.from({ length: 10 }, (_, i) => ({ day: `2026-10-${String(i + 1).padStart(2, "0")}`, commits: i }));
    render(<ActivityCalendar data={data} isLoading={false} />);
    expect(screen.getAllByLabelText(/^2026-10-\d\d: \d+ commits$/)).toHaveLength(10);
  });
});
