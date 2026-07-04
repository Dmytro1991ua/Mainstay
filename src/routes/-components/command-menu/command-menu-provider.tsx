import { createContext, use, useCallback, useMemo, useState } from "react";

import { useHotkey } from "@/shared/hooks/use-hotkey";

import { COMMAND_MENU_KEY } from "./command-menu.constants";

type CommandMenuContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
};

const CommandMenuContext = createContext<CommandMenuContextValue | null>(null);

/**
 * Owns the command-palette open state and the global ⌘K / Ctrl+K shortcut, so the
 * header trigger button and the palette itself share one source of truth. State
 * is intentionally NOT in the persisted `ui-store` — a palette that reopened
 * itself on reload would be a bug, not a feature.
 */
export function CommandMenuProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((o) => !o), []);

  useHotkey(COMMAND_MENU_KEY, toggle);

  const value = useMemo(() => ({ open, setOpen, toggle }), [open, toggle]);

  return <CommandMenuContext value={value}>{children}</CommandMenuContext>;
}

export function useCommandMenu(): CommandMenuContextValue {
  const ctx = use(CommandMenuContext);
  if (!ctx) throw new Error("useCommandMenu must be used within <CommandMenuProvider>");
  return ctx;
}
