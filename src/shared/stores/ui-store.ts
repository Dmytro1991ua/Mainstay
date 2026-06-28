import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark";
export type ThemePreference = Theme | "system";
export type Accent = "blue" | "indigo" | "violet" | "emerald";
export type Density = "comfortable" | "compact";

type UiState = {
  themePreference: ThemePreference;
  accent: Accent;
  density: Density;
  sidebarCollapsed: boolean;
  setThemePreference: (themePreference: ThemePreference) => void;
  setAccent: (accent: Accent) => void;
  setDensity: (density: Density) => void;
  toggleSidebar: () => void;
};

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      themePreference: "system",
      accent: "blue",
      density: "comfortable",
      sidebarCollapsed: false,
      setThemePreference: (themePreference) => set({ themePreference }),
      setAccent: (accent) => set({ accent }),
      setDensity: (density) => set({ density }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
    }),
    { name: "mainstay-ui" },
  ),
);
