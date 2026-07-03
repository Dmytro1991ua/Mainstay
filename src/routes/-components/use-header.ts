import { useLocation } from "@tanstack/react-router";

import { useLogout } from "@/features/auth";

const ROUTE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/inventory": "Inventory",
  "/tasks": "Tasks",
  "/notifications": "Notifications",
  "/users": "Users",
  "/settings": "Settings",
};

export const useHeader = () => {
  const { pathname } = useLocation();
  const logout = useLogout();

  return {
    title: ROUTE_TITLES[pathname] ?? "Mainstay",
    logout,
  };
};
