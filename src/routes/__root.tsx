import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { ReactElement } from "react";
import { NotFoundPage } from "@/components/core/NotFoundPage";
import { TooltipProvider } from "@/components/ui/tooltip";

function RootLayout(): ReactElement {
  return <TooltipProvider delayDuration={150}><Outlet /></TooltipProvider>;
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({ component: RootLayout, notFoundComponent: NotFoundPage });
