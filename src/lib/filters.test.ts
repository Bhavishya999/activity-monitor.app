import { describe, expect, it } from "vitest";
import { analyticsSearchSchema, filterSearchSchema, isQueryable, pagedSearchSchema, toApiQuery } from "./filters";

describe("filterSearchSchema", () => {
  it("defaults to the last 30 days", () => expect(filterSearchSchema.parse({}).range).toBe("last30"));
  it("falls back instead of throwing on hand-edited URLs", () => {
    const parsed = filterSearchSchema.parse({ range: "banana", teamId: "abc", from: "not-a-date", includeBots: "maybe" });
    expect(parsed).toMatchObject({ range: "last30", teamId: undefined, from: undefined, includeBots: undefined });
  });
  it("accepts numeric strings for ids", () => expect(filterSearchSchema.parse({ teamId: "7" }).teamId).toBe(7));
});

describe("pagedSearchSchema and analyticsSearchSchema", () => {
  it("clamps bad pages and sorts", () => {
    expect(pagedSearchSchema.parse({ page: "0", sort: "salary" })).toMatchObject({ page: 1, sort: "commits" });
    expect(pagedSearchSchema.parse({ page: "3" }).page).toBe(3);
  });
  it("defaults the grouping dimension", () => {
    expect(analyticsSearchSchema.parse({}).by).toBe("organization");
    expect(analyticsSearchSchema.parse({ by: "team" }).by).toBe("team");
    expect(analyticsSearchSchema.parse({ by: "nope" }).by).toBe("organization");
  });
});

describe("toApiQuery", () => {
  it("only sends what is set", () => {
    const q = toApiQuery(filterSearchSchema.parse({ teamId: 3, includeBots: true }));
    expect(q.toString()).toBe("range=last30&teamId=3&includeBots=true");
  });
  it("sends dates only for custom ranges", () => {
    expect(toApiQuery(filterSearchSchema.parse({ range: "last7", from: "2026-10-01", to: "2026-10-02" })).has("from")).toBe(false);
    expect(toApiQuery(filterSearchSchema.parse({ range: "custom", from: "2026-10-01", to: "2026-10-02" })).get("from")).toBe("2026-10-01");
  });
  it("merges extra params and skips empty ones", () => {
    const q = toApiQuery(filterSearchSchema.parse({}), { page: 2, q: "" , by: "team" });
    expect(q.get("page")).toBe("2");
    expect(q.has("q")).toBe(false);
    expect(q.get("by")).toBe("team");
  });
});

describe("isQueryable", () => {
  it("waits for a complete, ordered custom range", () => {
    expect(isQueryable(filterSearchSchema.parse({ range: "custom" }))).toBe(false);
    expect(isQueryable(filterSearchSchema.parse({ range: "custom", from: "2026-10-02", to: "2026-10-01" }))).toBe(false);
    expect(isQueryable(filterSearchSchema.parse({ range: "custom", from: "2026-10-01", to: "2026-10-02" }))).toBe(true);
    expect(isQueryable(filterSearchSchema.parse({}))).toBe(true);
  });
});
