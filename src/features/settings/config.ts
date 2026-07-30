import type { ThemePreference } from "@/shared/stores/ui-store";

export type SettingOption<T extends string> = { value: T; label: string };

export const THEME_OPTIONS: SettingOption<ThemePreference>[] = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

export const ROLE_LABEL: Record<string, string> = {
  ADMIN: "Admin",
  MANAGER: "Manager",
  TECHNICIAN: "Technician",
};
