import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import type { ThemePreference } from "@/shared/stores/ui-store";
import { useUiStore } from "@/shared/stores/ui-store";

const CYCLE: ThemePreference[] = ["light", "dark", "system"];

const ICONS: Record<ThemePreference, LucideIcon> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

export const ThemeToggleCycle = () => {
  const themePreference = useUiStore((s) => s.themePreference);
  const setThemePreference = useUiStore((s) => s.setThemePreference);

  const next = CYCLE[(CYCLE.indexOf(themePreference) + 1) % CYCLE.length];
  const Icon = ICONS[themePreference];

  return (
    <button
      type="button"
      onClick={() => setThemePreference(next)}
      title={`${themePreference} — click for ${next}`}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-lg",
        "border border-border-2 bg-panel text-text-2",
        "transition-colors hover:bg-panel-2 hover:text-text",
      )}
    >
      <Icon className="h-[17px] w-[17px]" />
    </button>
  );
};
