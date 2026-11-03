import { Outlet, useRouterState } from "@tanstack/react-router";
import { Toaster } from "sonner";

export function RootLayout() {
  const isLoading = useRouterState({ select: (s) => s.status === "pending" });

  return (
    <>
      {/* Global top-bar loading indicator */}
      {isLoading && (
        <div
          className="fixed inset-x-0 top-0 z-[9999] h-[3px] overflow-hidden"
          aria-hidden
        >
          <div
            className="h-full animate-[progress_1.4s_ease-in-out_infinite]"
            style={{ background: "var(--color-accent)" }}
          />
        </div>
      )}
      <Outlet />
      <Toaster
        position="bottom-right"
        richColors
        toastOptions={{
          style: {
            fontFamily: "var(--font-sans)",
            fontSize: "13px",
          },
        }}
      />
    </>
  );
}
