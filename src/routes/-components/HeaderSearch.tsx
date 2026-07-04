import { Search } from "lucide-react";

import { isMac } from "@/shared/lib/platform";
import { cn } from "@/shared/lib/utils";

import { useCommandMenu } from "./command-menu-provider";

/**
 * The header's search affordance — a button styled like an input that opens the
 * ⌘K palette (it isn't a real text field; typing happens inside the dialog). The
 * shortcut hint is platform-aware (⌘K on macOS, Ctrl K elsewhere).
 */
export function HeaderSearch() {
  const { setOpen } = useCommandMenu();
  const mac = isMac();

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className={cn(
        "flex h-9 w-full items-center gap-2 rounded-lg border border-border bg-panel px-2.5 text-left",
        "text-text-3 transition-colors hover:border-border-2 hover:text-text-2",
        "focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
      )}
      aria-label="Search"
    >
      <Search className="h-4 w-4 shrink-0" />
      <span className="min-w-0 flex-1 truncate text-sm">Search…</span>
      <kbd className="shrink-0 rounded border border-border bg-panel-2 px-1.5 py-0.5 text-[11px] font-medium text-text-3">
        {mac ? "⌘K" : "Ctrl K"}
      </kbd>
    </button>
  );
}
