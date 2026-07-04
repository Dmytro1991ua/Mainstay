import { useLocation } from "@tanstack/react-router";

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

  return {
    title: ROUTE_TITLES[pathname] ?? "Mainstay",
  };
};
