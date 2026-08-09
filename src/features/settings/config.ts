import type { ThemePreference } from "@/shared/stores/ui-store";

import type { NotificationPreferences } from "./api/settings-api";
import type { ChangePasswordFormValues } from "./hooks/use-change-password";
import type { ProfileFormValues } from "./hooks/use-update-profile";

export type SettingOption<T extends string> = { value: T; label: string };

export type ProfileFieldConfig = {
  name: keyof ProfileFormValues | "email";
  label: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  readOnly?: boolean;
};

export const PROFILE_EDIT_FIELDS: ProfileFieldConfig[] = [
  { name: "userName", label: "Username", autoComplete: "username", placeholder: "your_username" },
  { name: "email", label: "Email", type: "email", autoComplete: "email", readOnly: true },
];

export type PasswordFieldConfig = {
  name: keyof ChangePasswordFormValues;
  label: string;
  id: string;
  placeholder: string;
};

export const CHANGE_PASSWORD_FIELDS: PasswordFieldConfig[] = [
  {
    name: "currentPassword",
    label: "Current password",
    id: "current-password",
    placeholder: "Enter current password",
  },
  {
    name: "newPassword",
    label: "New password",
    id: "new-password",
    placeholder: "At least 8 characters",
  },
  {
    name: "confirmPassword",
    label: "Confirm new password",
    id: "confirm-password",
    placeholder: "Re-enter new password",
  },
];

export const THEME_OPTIONS: SettingOption<ThemePreference>[] = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

export const DEMO_ACCOUNT_NOTICE =
  "You're using a demo account. Profile and security changes are disabled to preserve the demo experience.";

export const ROLE_LABEL: Record<string, string> = {
  ADMIN: "Admin",
  MANAGER: "Manager",
  TECHNICIAN: "Technician",
};

export type NotificationPreferenceConfig = {
  key: keyof NotificationPreferences;
  label: string;
  description: string;
  technicianHidden?: true;
};

export const NOTIFICATION_PREFERENCE_CONFIG: NotificationPreferenceConfig[] = [
  {
    key: "LOW_STOCK",
    label: "Low Stock alerts",
    description: "Notify when an item falls below its minimum stock level",
    technicianHidden: true,
  },
  {
    key: "OUT_OF_STOCK",
    label: "Out of Stock alerts",
    description: "Notify when an item reaches zero units",
    technicianHidden: true,
  },
  {
    key: "TASK_OVERDUE",
    label: "Overdue task alerts",
    description: "Notify when an assigned task passes its due date",
  },
];
