import { Outlet } from "@tanstack/react-router";
import { Toaster } from "sonner";

export function RootLayout() {
  return (
    <>
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
