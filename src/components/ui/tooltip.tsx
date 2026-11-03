import * as RadixTooltip from "@radix-ui/react-tooltip";
import type { ReactElement, ReactNode } from "react";

export const TooltipProvider = RadixTooltip.Provider;

export function Tooltip({ content, children }: { content: ReactNode; children: ReactElement }): ReactElement {
  return (
    <RadixTooltip.Root delayDuration={150}>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content sideOffset={6} className="z-50 max-w-xs rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-fg shadow-pop">
          {content}
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  );
}
