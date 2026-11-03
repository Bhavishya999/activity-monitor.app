import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import type { ReactElement } from "react";
import { Avatar } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { logout } from "@/https/services/auth";
import { useMe } from "@/hooks/useMe";
import { setCsrfToken } from "@/lib/authSession";

const ROLE_LABELS = { DEVELOPER: "Developer", ADMIN: "Admin", SUPER_ADMIN: "Super Admin" } as const;

export function UserMenu(): ReactElement | null {
  const { data } = useMe();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  if (!data) return null;
  const { user } = data;

  async function onSignOut(): Promise<void> {
    try { await logout(); } finally {
      setCsrfToken(null);
      queryClient.clear();
      await navigate({ to: "/login" });
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label="Account menu" className="rounded-full outline-offset-2 cursor-pointer"><Avatar login={user.email} size="md" /></DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          <div className="text-sm font-medium text-fg">{user.name ?? user.email}</div>
          <div className="text-xs text-faint">{user.email}</div>
          <div className="mt-1 text-xs text-muted">{ROLE_LABELS[user.role]}</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => { void onSignOut(); }}><LogOut aria-hidden className="size-4" />Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
