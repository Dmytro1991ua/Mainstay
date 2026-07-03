import {
  Bell,
  ClipboardList,
  LayoutDashboard,
  type LucideIcon,
  Package,
  Settings,
  Users,
} from "lucide-react";

import { useAuthStore } from "@/shared/stores/auth-store";
import { useUiStore } from "@/shared/stores/ui-store";
import type { components } from "@/shared/types/api-generated";

type Role = components["schemas"]["User"]["roles"][number];

type NavItem = {
  to: "/dashboard" | "/inventory" | "/tasks" | "/notifications" | "/users" | "/settings";
  label: string;
  icon: LucideIcon;
  roles?: readonly Role[];
};

const NAV_ITEMS: readonly NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/inventory", label: "Inventory", icon: Package },
  { to: "/tasks", label: "Tasks", icon: ClipboardList },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/users", label: "Users", icon: Users, roles: ["ADMIN", "MANAGER"] },
  { to: "/settings", label: "Settings", icon: Settings },
];

export const useSidebar = () => {
  const user = useAuthStore((s) => s.user);
  const roles = user?.roles ?? [];
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles || item.roles.some((r) => roles.includes(r)),
  );

  return {
    collapsed,
    toggleSidebar,
    visibleItems,
    user,
    initials: user?.userName.slice(0, 2).toUpperCase() ?? "",
  };
};
