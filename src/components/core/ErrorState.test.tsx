import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ApiError } from "@/https/httpErrorHandler";
import { ErrorState } from "./ErrorState";

describe("ErrorState", () => {
  it("shows the server message and request id so support can trace it", () => {
    render(<ErrorState error={new ApiError(500, "Unexpected server error", "req-123")} />);
    expect(screen.getByRole("alert")).toHaveTextContent("Unexpected server error");
    expect(screen.getByText("req-123")).toBeInTheDocument();
  });
  it("offers a retry that calls back", () => {
    const onRetry = vi.fn();
    render(<ErrorState error={new Error("boom")} onRetry={onRetry} />);
    fireEvent.click(screen.getByRole("button", { name: /try again/i }));
    expect(onRetry).toHaveBeenCalledOnce();
  });
  it("explains network failures in plain words", () => {
    render(<ErrorState error={new TypeError("Failed to fetch")} />);
    expect(screen.getByRole("alert")).toHaveTextContent(/cannot reach the server/i);
  });
});
