import * as Menu from "@radix-ui/react-dropdown-menu";
import type { ComponentProps, ReactElement } from "react";
import { cn } from "@/lib/cn";

export const DropdownMenu = Menu.Root;
export const DropdownMenuTrigger = Menu.Trigger;

export function DropdownMenuContent({ className, ...props }: ComponentProps<typeof Menu.Content>): ReactElement {
  return (
    <Menu.Portal>
      <Menu.Content sideOffset={8} align="end" className={cn("z-50 min-w-56 rounded-xl border border-border bg-surface p-1.5 shadow-pop", className)} {...props} />
    </Menu.Portal>
  );
}

export function DropdownMenuItem({ className, ...props }: ComponentProps<typeof Menu.Item>): ReactElement {
  return <Menu.Item className={cn("flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-fg outline-none data-[highlighted]:bg-surface-2", className)} {...props} />;
}

export function DropdownMenuLabel({ className, ...props }: ComponentProps<typeof Menu.Label>): ReactElement {
  return <Menu.Label className={cn("px-2.5 py-1.5 text-xs text-faint", className)} {...props} />;
}

export function DropdownMenuSeparator({ className, ...props }: ComponentProps<typeof Menu.Separator>): ReactElement {
  return <Menu.Separator className={cn("my-1 h-px bg-border", className)} {...props} />;
}
