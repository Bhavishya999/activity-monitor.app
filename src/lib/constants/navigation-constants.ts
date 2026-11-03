import { Activity, BarChart3, Building2, FileText, FolderGit2, GitCommitHorizontal, LayoutDashboard, RefreshCw, Settings, ShieldCheck, Users, UsersRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = { to: string; label: string; icon: LucideIcon; adminOnly: boolean };

export const NAV_ITEMS: readonly NavItem[] = [
  { to: "/overview", label: "Overview", icon: LayoutDashboard, adminOnly: false },
  { to: "/developers", label: "Developers", icon: Users, adminOnly: false },
  { to: "/repositories", label: "Repositories", icon: FolderGit2, adminOnly: false },
  { to: "/teams", label: "Teams", icon: UsersRound, adminOnly: false },
  { to: "/github-accounts", label: "GitHub Accounts", icon: Building2, adminOnly: false },
  { to: "/commits", label: "Commit History", icon: GitCommitHorizontal, adminOnly: false },
  { to: "/analytics", label: "Analytics", icon: BarChart3, adminOnly: false },
  { to: "/reports", label: "Reports", icon: FileText, adminOnly: false },
  { to: "/synchronization", label: "Synchronization", icon: RefreshCw, adminOnly: true },
  { to: "/administration", label: "Administration", icon: ShieldCheck, adminOnly: true },
  { to: "/settings", label: "Settings", icon: Settings, adminOnly: true },
] as const;

export const BRAND_ICON = Activity;
