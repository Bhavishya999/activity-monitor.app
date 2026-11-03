import { redirect } from "@tanstack/react-router";
import { queryClient } from "../lib/queryClient";
import { getMeApi } from "../https/services/auth";
import type { AuthUser } from "../lib/authSession";
import type { RoleName } from "../lib/interfaces/admin";

const ME_OPTS = { queryKey: ["me"], queryFn: getMeApi, staleTime: 60_000 } as const;

const ROLE_RANK: Record<RoleName, number> = {
  DEVELOPER: 0,
  MANAGER: 1,
  ADMIN: 2,
  SUPER_ADMIN: 3,
};

type BeforeLoadContext = {
  location: { pathname: string; search: string };
};

/**
 * Redirect unauthenticated users to /login, preserving the intended URL in
 * `?redirectTo=` so the login page can send them back after a successful login.
 * Attaches the resolved user to the router context for downstream beforeLoad hooks.
 */
export async function requireAuth({ location }: BeforeLoadContext) {
  try {
    const user = await queryClient.fetchQuery(ME_OPTS);
    return { user };
  } catch {
    const redirectTo = location.pathname + location.search;
    throw redirect({
      to: "/login",
      search: { redirectTo: redirectTo !== "/" ? redirectTo : undefined },
    });
  }
}

/**
 * Redirect already-authenticated users away from guest-only pages (e.g. /login).
 */
export async function requireGuest() {
  try {
    await queryClient.fetchQuery(ME_OPTS);
    throw redirect({ to: "/" });
  } catch (e) {
    if (e instanceof Response || (e as { _isRedirect?: boolean })._isRedirect) throw e;
    // Fetch failed → not logged in, stay on the page
  }
}

type RoleContext = {
  context: { user?: AuthUser | undefined };
};

/**
 * Factory: enforce a minimum role on a protected route.
 * Must be used on a route that already ran requireAuth (so context.user is set).
 *
 * @example
 *   beforeLoad: requireRole("ADMIN")
 */
export function requireRole(minRole: RoleName) {
  return function roleGuard({ context }: RoleContext) {
    const userRole = context.user?.role as RoleName | undefined;
    const rank = userRole !== undefined ? (ROLE_RANK[userRole] ?? -1) : -1;

    if (rank < (ROLE_RANK[minRole] ?? 0)) {
      // Authenticated but insufficient role → back to overview
      throw redirect({ to: "/" });
    }
  };
}
