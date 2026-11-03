import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./rootRoute";
import { requireAuth, requireRole } from "../middleware/routeAuthMiddleware";
import { DashboardLayout } from "../components/core/DashboardLayout";
import { AppLoadingScreen } from "../components/core/AppLoadingScreen";
import { OverviewPage } from "../pages/OverviewPage";
import { DevelopersPage } from "../pages/DevelopersPage";
import { DeveloperDetailPage } from "../pages/DeveloperDetailPage";
import { RepositoriesPage } from "../pages/RepositoriesPage";
import { RepositoryDetailPage } from "../pages/RepositoryDetailPage";
import { CommitsPage } from "../pages/CommitsPage";
import { GitHubAccountsPage } from "../pages/GitHubAccountsPage";
import { AdminPage } from "../pages/AdminPage";

// ── Protected layout — runs requireAuth for every child route ────
export const dashboardLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  beforeLoad: requireAuth,
  component: DashboardLayout,
  pendingComponent: AppLoadingScreen,
  pendingMs: 200,
  pendingMinMs: 300,
});

// ── Child routes — each states only its own path and component ───
const overviewRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/",
  component: OverviewPage,
});

const developersRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/developers",
  component: DevelopersPage,
});

const developerDetailRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/developers/$id",
  component: DeveloperDetailPage,
});

const repositoriesRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/repositories",
  component: RepositoriesPage,
});

const repositoryDetailRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/repositories/$id",
  component: RepositoryDetailPage,
});

const commitsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/commits",
  component: CommitsPage,
});

// Admin-only routes — requireRole runs after requireAuth has set context.user
const githubAccountsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/github-accounts",
  beforeLoad: requireRole("ADMIN"),
  component: GitHubAccountsPage,
});

const adminRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/admin",
  beforeLoad: requireRole("ADMIN"),
  component: AdminPage,
});

export const dashboardChildRoutes = [
  overviewRoute,
  developersRoute,
  developerDetailRoute,
  repositoriesRoute,
  repositoryDetailRoute,
  commitsRoute,
  githubAccountsRoute,
  adminRoute,
] as const;
