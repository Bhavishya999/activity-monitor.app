import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import type { ReactElement } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { BRAND_ICON, NAV_ITEMS } from "@/lib/constants/navigation-constants";
import { useMe } from "@/hooks/useMe";

type AppSidebarProps = { isOpen: boolean; onClose: () => void };

export function AppSidebar({ isOpen, onClose }: AppSidebarProps): ReactElement {
  const { data } = useMe();
  const isAdmin = data?.user.role === "ADMIN" || data?.user.role === "SUPER_ADMIN";
  const Brand = BRAND_ICON;
  const items = NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin);

  return (
    <>
      {isOpen ? <button type="button" aria-label="Close menu" className="fixed inset-0 z-30 bg-black/40 lg:hidden cursor-pointer" onClick={onClose} /> : null}
      <aside className={cn("fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-surface transition-transform lg:translate-x-0", isOpen ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex h-14 items-center justify-between px-4">
          <Link to="/overview" className="flex items-center gap-2.5" onClick={onClose}>
            <span className="rounded-lg bg-accent p-1.5 text-white"><Brand aria-hidden className="size-4" /></span>
            <span className="text-sm font-semibold tracking-tight">Git Activity Monitor</span>
          </Link>
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Close menu" onClick={onClose}><X className="size-4" /></Button>
        </div>
        <nav aria-label="Main" className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
          {items.map(({ to, label, icon: Icon }) => (
            <Link
              key={to} to={to} onClick={onClose}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-fg"
              activeProps={{ className: "bg-accent-soft !text-accent-strong font-medium", "aria-current": "page" }}
            >
              <Icon aria-hidden className="size-4" />{label}
            </Link>
          ))}
        </nav>
        <p className="border-t border-border px-4 py-3 text-[11px] leading-snug text-faint">Commit counts show activity, not productivity or quality.</p>
      </aside>
    </>
  );
}
