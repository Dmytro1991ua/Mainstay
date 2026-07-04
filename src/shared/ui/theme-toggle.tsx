import { Monitor, Moon, Sun } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import type { ThemePreference } from "@/shared/stores/ui-store";
import { useUiStore } from "@/shared/stores/ui-store";

const THEME_OPTIONS: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export const ThemeToggle = () => {
  const themePreference = useUiStore((s) => s.themePreference);
  const setThemePreference = useUiStore((s) => s.setThemePreference);

  return (
    <div className={cn("flex items-center gap-0.5 rounded-lg bg-panel-2 p-0.5")}>
      {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => setThemePreference(value)}
          title={label}
          aria-pressed={themePreference === value}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-md text-text-3 transition-colors hover:text-text",
            themePreference === value && "bg-bg text-text shadow-xs",
          )}
        >
          <Icon className="h-3.75 w-3.75" />
        </button>
      ))}
    </div>
  );
};
