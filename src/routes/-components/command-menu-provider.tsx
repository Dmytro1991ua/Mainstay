import { createContext, use, useCallback, useEffect, useMemo, useState } from "react";

type CommandMenuContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
};

const CommandMenuContext = createContext<CommandMenuContextValue | null>(null);

/**
 * Owns the command-palette open state and the global ⌘K / Ctrl+K shortcut, so the
 * header trigger button and the palette itself share one source of truth. State
 * is intentionally NOT in the persisted `ui-store` — a palette that reopens itself
 * on reload would be a bug, not a feature.
 */
export function CommandMenuProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((o) => !o), []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggle]);

  const value = useMemo(() => ({ open, setOpen, toggle }), [open, toggle]);

  return <CommandMenuContext value={value}>{children}</CommandMenuContext>;
}

export function useCommandMenu(): CommandMenuContextValue {
  const ctx = use(CommandMenuContext);
  if (!ctx) throw new Error("useCommandMenu must be used within <CommandMenuProvider>");
  return ctx;
}
