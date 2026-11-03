import { useCallback, useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY } from "@/lib/constants/app-constants";

export type ThemeChoice = "light" | "dark" | "system";

const listeners = new Set<() => void>();

function readChoice(): ThemeChoice {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : "system";
  } catch { return "system"; }
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function useTheme(): { theme: ThemeChoice; setTheme: (next: ThemeChoice) => void } {
  const theme = useSyncExternalStore(subscribe, readChoice, () => "system" as const);
  const setTheme = useCallback((next: ThemeChoice) => {
    try {
      if (next === "system") localStorage.removeItem(THEME_STORAGE_KEY); else localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch { /* storage may be blocked; the choice still applies for this page view */ }
    if (next === "system") delete document.documentElement.dataset["theme"]; else document.documentElement.dataset["theme"] = next;
    listeners.forEach((l) => { l(); });
  }, []);
  return { theme, setTheme };
}
