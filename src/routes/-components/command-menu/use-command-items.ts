import { useNavigate } from "@tanstack/react-router";
import { LogOut, Moon, PanelLeft, Sun } from "lucide-react";
import { useMemo } from "react";

import { useLogout } from "@/features/auth";
import { useAuthStore } from "@/shared/stores/auth-store";
import { useUiStore } from "@/shared/stores/ui-store";
import type { CommandItem } from "@/shared/ui/command-menu";

import { getVisibleNavItems } from "../nav-config";

import { COMMAND_GROUP } from "./constants";

/**
 * Assembles the ⌘K palette's searchable set from the same role-filtered nav
 * config the sidebar uses, plus a few workspace actions, binding each to a real
 * effect (navigate / toggle theme / toggle sidebar / log out). New sources
 * (inventory items, tasks, users) slot in here as extra groups.
 *
 * Every dependency is referentially stable (router `navigate`, zustand actions,
 * react-query `mutate`) except the values the labels actually depend on, so the
 * memoized array only changes when the visible items genuinely change.
 */
export const useCommandItems = (): CommandItem[] => {
  const navigate = useNavigate();
  const { mutate: signOut } = useLogout();
  const roles = useAuthStore((s) => s.user?.roles);
  const themePreference = useUiStore((s) => s.themePreference);
  const setThemePreference = useUiStore((s) => s.setThemePreference);
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);

  return useMemo<CommandItem[]>(() => {
    const nav: CommandItem[] = getVisibleNavItems(roles ?? []).map((item) => ({
      id: `nav:${item.to}`,
      label: item.label,
      group: COMMAND_GROUP.NAVIGATION,
      icon: item.icon,
      hint: "Jump to",
      keywords: "go open page",
      onSelect: () => navigate({ to: item.to }),
    }));

    const nextTheme = themePreference === "dark" ? "light" : "dark";
    const actions: CommandItem[] = [
      {
        id: "action:theme",
        label: `Switch to ${nextTheme} theme`,
        group: COMMAND_GROUP.ACTIONS,
        icon: nextTheme === "dark" ? Moon : Sun,
        keywords: "dark light appearance mode",
        onSelect: () => setThemePreference(nextTheme),
      },
      {
        id: "action:sidebar",
        label: collapsed ? "Expand sidebar" : "Collapse sidebar",
        group: COMMAND_GROUP.ACTIONS,
        icon: PanelLeft,
        keywords: "toggle nav rail",
        onSelect: toggleSidebar,
      },
      {
        id: "action:logout",
        label: "Log out",
        group: COMMAND_GROUP.ACTIONS,
        icon: LogOut,
        keywords: "sign out exit session",
        onSelect: () => signOut(),
      },
    ];

    return [...nav, ...actions];
  }, [roles, themePreference, collapsed, navigate, setThemePreference, toggleSidebar, signOut]);
};
