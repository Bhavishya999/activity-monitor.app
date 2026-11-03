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
  location: { pathname: string; searchStr: string };
};

export async function requireAuth({ location }: BeforeLoadContext) {
  try {
    const user = await queryClient.fetchQuery(ME_OPTS);
    return { user };
  } catch {
    const redirectTo = location.pathname + location.searchStr;
    throw redirect({
      to: "/login",
      search: { redirectTo: redirectTo !== "/login" ? redirectTo : undefined },
    });
  }
}

/**
 * Redirect already-authenticated users away from guest-only pages (e.g. /login).
 */
export async function requireGuest() {
  try {
    await queryClient.fetchQuery(ME_OPTS);
    throw redirect({ to: "/dashboard" });
  } catch (e) {
    if (e instanceof Response || (e as { _isRedirect?: boolean })._isRedirect) throw e;
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
      throw redirect({ to: "/dashboard" });
    }
  };
}
