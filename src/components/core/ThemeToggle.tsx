import { Monitor, Moon, Sun } from "lucide-react";
import type { ReactElement } from "react";
import { cn } from "@/lib/cn";
import { useTheme, type ThemeChoice } from "@/hooks/useTheme";

const OPTIONS = [["light", Sun, "Light"], ["system", Monitor, "System"], ["dark", Moon, "Dark"]] as const satisfies readonly (readonly [ThemeChoice, unknown, string])[];

export function ThemeToggle(): ReactElement {
  const { theme, setTheme } = useTheme();
  return (
    <div role="radiogroup" aria-label="Theme" className="inline-flex rounded-lg border border-border bg-surface p-0.5">
      {OPTIONS.map(([id, Icon, label]) => (
        <button
          key={id} type="button" role="radio" aria-checked={theme === id} aria-label={label} onClick={() => { setTheme(id); }}
          className={cn("rounded-md p-1.5 text-faint transition-colors hover:text-fg cursor-pointer", theme === id && "bg-surface-2 text-fg")}
        ><Icon className="size-3.5" /></button>
      ))}
    </div>
  );
}
