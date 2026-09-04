import {
  Bell,
  CalendarClock,
  ClipboardList,
  HardHat,
  LayoutDashboard,
  type LucideIcon,
  Package,
  Settings,
  Users,
} from "lucide-react";

import type { components } from "@/shared/types/api-generated";

export type Role = components["schemas"]["User"]["roles"][number];

/** Every navigable app path. Kept as a literal union so `Link`/`navigate` stay type-checked. */
export type AppPath =
  | "/dashboard"
  | "/inventory"
  | "/assets"
  | "/tasks"
  | "/recurring-tasks"
  | "/notifications"
  | "/users"
  | "/settings";

export type NavItem = {
  to: AppPath;
  label: string;
  icon: LucideIcon;
  /** When set, the item only shows for users holding at least one of these roles. */
  roles?: readonly Role[];
};

/**
 * Single source of truth for primary navigation. Consumed by the sidebar, the
 * header breadcrumbs, and the ⌘K command menu — so a route added here appears in
 * all three at once and can never drift between them.
 */
export const NAV_ITEMS: readonly NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/inventory", label: "Inventory", icon: Package },
  { to: "/assets", label: "Assets", icon: HardHat },
  { to: "/tasks", label: "Tasks", icon: ClipboardList },
  {
    to: "/recurring-tasks",
    label: "Schedules",
    icon: CalendarClock,
    roles: ["ADMIN", "MANAGER"],
  },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/users", label: "Users", icon: Users, roles: ["ADMIN", "MANAGER"] },
  { to: "/settings", label: "Settings", icon: Settings },
];

/** Nav items the given roles are allowed to see (role-gated items filtered out). */
export const getVisibleNavItems = (roles: readonly Role[]): readonly NavItem[] =>
  NAV_ITEMS.filter((item) => !item.roles || item.roles.some((r) => roles.includes(r)));

/** Path → human label, for breadcrumb/title lookups. */
export const ROUTE_LABELS: Record<string, string> = Object.fromEntries(
  NAV_ITEMS.map((item) => [item.to, item.label]),
);
