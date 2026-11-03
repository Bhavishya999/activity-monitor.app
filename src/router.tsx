import { createRouter } from "@tanstack/react-router";
import { rootRoute } from "./routes/rootRoute";
import { publicRoutes } from "./routes/publicRoutes";
import { dashboardLayoutRoute, dashboardChildRoutes } from "./routes/dashboardRoutes";

const routeTree = rootRoute.addChildren([
  ...publicRoutes,
  dashboardLayoutRoute.addChildren([...dashboardChildRoutes]),
]);

export const router = createRouter({ routeTree, context: {} });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
