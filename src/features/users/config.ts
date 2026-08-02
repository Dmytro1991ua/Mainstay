import type { FilterConfig } from "@/shared/ui/data-table";

import type { UserRole } from "./api/users-api";

export const USERS_REFETCH_INTERVAL = 30_000;

export type DisplayStatus = "ACTIVE" | "INACTIVE" | "PENDING";

export const ROLE_BADGE_CONFIG: Record<UserRole, { label: string; classes: string }> = {
  ADMIN: {
    label: "Admin",
    classes: "text-accent bg-accent-soft border-accent-border",
  },
  MANAGER: {
    label: "Manager",
    classes: "text-amber bg-amber-soft border-amber-border",
  },
  TECHNICIAN: {
    label: "Technician",
    classes: "text-purple bg-purple-soft border-purple-border",
  },
};

export const ROLE_OPTIONS: { label: string; value: UserRole }[] = [
  { label: "Admin", value: "ADMIN" },
  { label: "Manager", value: "MANAGER" },
  { label: "Technician", value: "TECHNICIAN" },
];

export const STATUS_BADGE_CONFIG: Record<DisplayStatus, { label: string; classes: string }> = {
  ACTIVE: {
    label: "Active",
    classes: "text-green bg-green-soft border-green-border",
  },
  INACTIVE: {
    label: "Inactive",
    classes: "text-red bg-red-soft border-red-border",
  },
  PENDING: {
    label: "Pending",
    classes: "text-amber bg-amber-soft border-amber-border",
  },
};

export const USER_FILTER_CONFIG: FilterConfig[] = [
  { id: "role", label: "Role", type: "single", options: ROLE_OPTIONS },
  {
    id: "status",
    label: "Status",
    type: "single",
    options: [
      { label: "Active", value: "ACTIVE" },
      { label: "Inactive", value: "INACTIVE" },
      { label: "Pending", value: "PENDING" },
    ],
  },
];
