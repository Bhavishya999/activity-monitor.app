type TableFetchingOverlayProps = {
  isFetching: boolean;
  isPlaceholderData: boolean;
  children: React.ReactNode;
};

export function TableFetchingOverlay({ isFetching, isPlaceholderData, children }: TableFetchingOverlayProps) {
  const dimming = isFetching && isPlaceholderData;

  return (
    <div className="relative">
      {dimming && (
        <div
          className="absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 shadow-sm"
          aria-live="polite"
          aria-label="Updating data"
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{
              background: "var(--color-accent)",
              animation: "pulse 1.5s ease-in-out infinite",
            }}
            aria-hidden
          />
          <span className="text-[11px] font-medium text-muted-foreground">Updating…</span>
        </div>
      )}
      <div
        className="transition-opacity duration-200"
        style={{ opacity: dimming ? 0.6 : 1, pointerEvents: dimming ? "none" : undefined }}
      >
        {children}
      </div>
    </div>
  );
}
