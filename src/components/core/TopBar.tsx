import { Menu } from "lucide-react";
import type { ReactElement } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMeta } from "@/hooks/useMeta";
import { timezoneLabel } from "@/lib/format";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";

export function TopBar({ onMenu }: { onMenu: () => void }): ReactElement {
  const { data: meta } = useMeta();
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-border bg-[color-mix(in_srgb,var(--bg)_82%,transparent)] px-4 backdrop-blur sm:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu" onClick={onMenu}><Menu className="size-5" /></Button>
      <div className="ml-auto flex items-center gap-3">
        {meta ? <Badge tone="neutral" title={meta.timezone}>All times in {timezoneLabel(meta.timezone)}</Badge> : null}
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
