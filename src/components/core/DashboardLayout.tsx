import { useMemo } from "react";
import { Outlet, Link, useRouter } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  GitCommitHorizontal,
  LayoutDashboard,
  Users,
  FolderGit2,
  LogOut,
  Github,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { getMeApi, logoutApi } from "../../https/services/auth";
import { clearSession } from "../../lib/authSession";
import { cn } from "../../lib/utils";
import type { RoleName } from "../../lib/interfaces/admin";

type NavItem = {
  label: string;
  icon: React.ElementType;
  to: string;
  minRole?: RoleName;
};

const ROLE_RANK: Record<RoleName, number> = {
  DEVELOPER: 0,
  MANAGER: 1,
  ADMIN: 2,
  SUPER_ADMIN: 3,
};

function hasRole(userRole: RoleName | undefined, minRole: RoleName): boolean {
  if (!userRole) return false;
  return (ROLE_RANK[userRole] ?? -1) >= (ROLE_RANK[minRole] ?? 0);
}

const NAV_ITEMS: NavItem[] = [
  { label: "Overview", icon: LayoutDashboard, to: "/dashboard" },
  { label: "Developers", icon: Users, to: "/dashboard/developers" },
  { label: "Repositories", icon: FolderGit2, to: "/dashboard/repositories" },
  { label: "Commits", icon: GitCommitHorizontal, to: "/dashboard/commits" },
  { label: "GitHub Accounts", icon: Github, to: "/dashboard/github-accounts", minRole: "ADMIN" },
  { label: "Administration", icon: ShieldCheck, to: "/dashboard/admin", minRole: "ADMIN" },
];

export function DashboardLayout() {
  const { data: user } = useQuery({ queryKey: ["me"], queryFn: getMeApi });
  const qc = useQueryClient();
  const router = useRouter();

  const logout = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      clearSession();
      qc.clear();
      void router.navigate({ to: "/login" });
    },
  });

  // Only recompute when the user's role changes
  const visibleItems = useMemo(
    () =>
      NAV_ITEMS.filter((item) =>
        item.minRole ? hasRole(user?.role as RoleName | undefined, item.minRole) : true,
      ),
    [user?.role],
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className="flex w-[220px] shrink-0 flex-col border-r border-border bg-card"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        {/* Logo */}
        <div className="flex h-14 items-center gap-2.5 border-b border-border px-4">
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
            style={{ background: "oklch(0.560 0.230 265)" }}
          >
            <img src="/logo.svg" alt="Git Activity Monitor" className="h-4.5 w-4.5" />
          </div>
          <span className="truncate text-[13px] font-semibold tracking-tight">
            Git Activity Monitor
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-2" aria-label="Main navigation">
          {visibleItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "group relative flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] transition-all duration-150",
                "text-muted-foreground hover:bg-muted hover:text-foreground",
                "[&.active]:font-medium [&.active]:text-foreground",
              )}
              style={
                {
                  "--active-bg": "oklch(0.945 0.040 265)",
                  "--active-color": "oklch(0.560 0.230 265)",
                } as React.CSSProperties
              }
            >
              {/* Active indicator bar */}
              <span
                className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full opacity-0 transition-opacity [.active_&]:opacity-100"
                style={{ background: "oklch(0.560 0.230 265)" }}
                aria-hidden
              />
              <item.icon
                className="h-4 w-4 shrink-0 transition-transform duration-150 group-hover:scale-105"
                aria-hidden
              />
              <span className="flex-1">{item.label}</span>
              <ChevronRight className="h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-30 [.active_&]:opacity-0" />
            </Link>
          ))}
        </nav>

        {/* User footer */}
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
            <div
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold uppercase text-white"
              style={{ background: "oklch(0.560 0.230 265)" }}
              aria-hidden
            >
              {user?.email?.[0] ?? "?"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-medium">{user?.email ?? "—"}</p>
              <p className="text-[11px] text-muted-foreground">{user?.role ?? ""}</p>
            </div>
            <button
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
              className="ml-1 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40"
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
