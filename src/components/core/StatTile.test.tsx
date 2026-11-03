import { render, screen } from "@testing-library/react";
import { GitCommitHorizontal } from "lucide-react";
import { describe, expect, it } from "vitest";
import { StatTile } from "./StatTile";

describe("StatTile", () => {
  it("formats numbers", () => {
    render(<StatTile label="Commits" value={12345} icon={GitCommitHorizontal} isLoading={false} />);
    expect(screen.getByText("12,345")).toBeInTheDocument();
  });
  it("shows -- for an unknown value rather than a misleading 0", () => {
    render(<StatTile label="Commits" value={undefined} icon={GitCommitHorizontal} isLoading={false} />);
    expect(screen.getByText("--")).toBeInTheDocument();
  });
  it("hides the value behind a skeleton while loading", () => {
    render(<StatTile label="Commits" value={5} icon={GitCommitHorizontal} isLoading />);
    expect(screen.queryByText("5")).not.toBeInTheDocument();
  });
  it("passes text values through (dates)", () => {
    render(<StatTile label="First commit" value="Jul 7, 2026" icon={GitCommitHorizontal} isLoading={false} />);
    expect(screen.getByText("Jul 7, 2026")).toBeInTheDocument();
  });
});
