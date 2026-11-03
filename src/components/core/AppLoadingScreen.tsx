export function AppLoadingScreen() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-5"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.420 0.230 280) 0%, oklch(0.560 0.230 265) 50%, oklch(0.520 0.200 240) 100%)",
      }}
      aria-label="Loading application"
      role="status"
    >
      <div
        className="flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg"
        style={{
          background: "oklch(1 0 0 / 0.15)",
          animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        }}
      >
        <img src="/logo.svg" alt="" className="h-9 w-9" aria-hidden />
      </div>
      <p className="text-[13px] font-medium text-white/70">Loading…</p>
    </div>
  );
}
