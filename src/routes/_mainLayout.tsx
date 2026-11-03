import { createFileRoute } from "@tanstack/react-router";
import { MainLayout } from "@/components/core/MainLayout";
import { ErrorState } from "@/components/core/ErrorState";
import { requireSession } from "@/middleware/routeAuthMiddleware";

export const Route = createFileRoute("/_mainLayout")({
  beforeLoad: ({ context }) => requireSession(context.queryClient),
  component: MainLayout,
  errorComponent: ({ error }) => <div className="mx-auto max-w-xl px-4 py-20"><ErrorState error={error} /></div>,
});
