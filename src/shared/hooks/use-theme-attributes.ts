import { useEffect } from "react";

import type { Theme } from "@/shared/stores/ui-store";
import { useUiStore } from "@/shared/stores/ui-store";

import { useMediaQuery } from "./use-media-query";

export const useThemeAttributes = () => {
  const themePreference = useUiStore((s) => s.themePreference);
  const accent = useUiStore((s) => s.accent);
  const density = useUiStore((s) => s.density);
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");

  const theme: Theme =
    themePreference === "system" ? (prefersDark ? "dark" : "light") : themePreference;

  useEffect(() => {
    const root = document.documentElement;

    root.dataset.theme = theme;

    if (accent === "blue") delete root.dataset.accent;
    else root.dataset.accent = accent;

    root.dataset.density = density;
  }, [theme, accent, density]);
};
