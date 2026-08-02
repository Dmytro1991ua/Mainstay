import { useLogout } from "@/features/auth";
import { useAuthStore } from "@/shared/stores/auth-store";
import { useUiStore } from "@/shared/stores/ui-store";
import { formatUserName } from "@/shared/utils";

import { getVisibleNavItems } from "../nav-config";

export const useSidebar = () => {
  const user = useAuthStore((s) => s.user);
  const roles = user?.roles ?? [];
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const logout = useLogout();

  const visibleItems = getVisibleNavItems(roles);
  const displayName = user ? formatUserName(user.userName) : "";

  return {
    collapsed,
    toggleSidebar,
    visibleItems,
    user,
    logout,
    displayName,
    initials: displayName.slice(0, 2).toUpperCase(),
  };
};
