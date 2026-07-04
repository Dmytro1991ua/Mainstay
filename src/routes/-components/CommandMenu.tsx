import { useNavigate } from "@tanstack/react-router";
import { LogOut, Moon, PanelLeft, Sun } from "lucide-react";
import { useMemo } from "react";

import { useLogout } from "@/features/auth";
import { useAuthStore } from "@/shared/stores/auth-store";
import { useUiStore } from "@/shared/stores/ui-store";
import { CommandMenu as CommandMenuPrimitive, type CommandItem } from "@/shared/ui/command-menu";

import { useCommandMenu } from "./command-menu-provider";
import { getVisibleNavItems } from "./nav-config";

/**
 * App wiring for the ⌘K palette: assembles the searchable set from the same
 * role-filtered nav config the sidebar uses, plus a few workspace actions, and
 * binds each to a real effect (navigate / toggle theme / toggle sidebar / log
 * out). New sources (inventory items, tasks, users) drop in here as extra groups
 * without touching the reusable primitive.
 */
export function CommandMenu() {
  const { open, setOpen } = useCommandMenu();
  const navigate = useNavigate();
  const logout = useLogout();

  const roles = useAuthStore((s) => s.user?.roles);
  const themePreference = useUiStore((s) => s.themePreference);
  const setThemePreference = useUiStore((s) => s.setThemePreference);
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);

  const items = useMemo<CommandItem[]>(() => {
    const nav: CommandItem[] = getVisibleNavItems(roles ?? []).map((item) => ({
      id: `nav:${item.to}`,
      label: item.label,
      group: "Navigation",
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
        group: "Actions",
        icon: nextTheme === "dark" ? Moon : Sun,
        keywords: "dark light appearance mode",
        onSelect: () => setThemePreference(nextTheme),
      },
      {
        id: "action:sidebar",
        label: collapsed ? "Expand sidebar" : "Collapse sidebar",
        group: "Actions",
        icon: PanelLeft,
        keywords: "toggle nav rail",
        onSelect: toggleSidebar,
      },
      {
        id: "action:logout",
        label: "Log out",
        group: "Actions",
        icon: LogOut,
        keywords: "sign out exit session",
        onSelect: () => logout.mutate(),
      },
    ];

    return [...nav, ...actions];
  }, [roles, themePreference, collapsed, navigate, setThemePreference, toggleSidebar, logout]);

  return <CommandMenuPrimitive open={open} onOpenChange={setOpen} items={items} />;
}
