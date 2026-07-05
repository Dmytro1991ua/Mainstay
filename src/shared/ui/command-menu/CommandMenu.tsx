import { CornerDownLeft, Search } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { type ReactNode, useRef } from "react";

import { cn } from "@/shared/lib/utils";

import { CommandList } from "./CommandList";
import { DEFAULT_EMPTY_MESSAGE, DEFAULT_PLACEHOLDER } from "./constants";
import { useCommandList } from "./use-command-list";

import type { CommandMenuProps } from "./types";

const SHORTCUT_HINTS: { keys: ReactNode[]; label: string }[] = [
  { keys: ["↑", "↓"], label: "navigate" },
  { keys: [<CornerDownLeft key="enter" className="h-3 w-3" />], label: "select" },
  { keys: ["esc"], label: "close" },
];

function CommandFooter() {
  return (
    <div className="flex items-center gap-4 border-t border-border px-4 py-2 text-[11px] text-text-3">
      {SHORTCUT_HINTS.map((hint) => (
        <span key={hint.label} className="flex items-center gap-1">
          {hint.keys.map((key, i) => (
            <kbd key={i} className="rounded border border-border bg-panel-2 px-1">
              {key}
            </kbd>
          ))}
          {hint.label}
        </span>
      ))}
    </div>
  );
}

/**
 * Dependency-free command palette (no `cmdk`) built on the Radix Dialog for its
 * focus trap, Esc handling, and a11y. This component is the dialog shell only —
 * behaviour lives in `useCommandList`, the results in `CommandList`. Purely
 * presentational: it knows nothing about routes or auth, so callers pass in
 * `items` with their own `onSelect`, which keeps it reusable and lets the
 * searchable set grow (inventory, tasks, …) without touching this file.
 */
export function CommandMenu({
  open,
  onOpenChange,
  items,
  placeholder = DEFAULT_PLACEHOLDER,
  emptyMessage = DEFAULT_EMPTY_MESSAGE,
}: CommandMenuProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { query, setQuery, reset, rendered, activeIndex, setActive, selectAt, onKeyDown, listRef } =
    useCommandList({ items, onClose: () => onOpenChange(false) });

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            reset();
            inputRef.current?.focus();
          }}
          className={cn(
            "fixed top-[14%] left-1/2 z-50 w-[calc(100%-2rem)] max-w-[560px] -translate-x-1/2",
            "overflow-hidden rounded-2xl border border-border bg-panel text-text shadow-lg",
          )}
        >
          <DialogPrimitive.Title className="sr-only">Command menu</DialogPrimitive.Title>

          <div className="flex items-center gap-2.5 border-b border-border px-4">
            <Search className="h-4.5 w-4.5 shrink-0 text-text-3" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={placeholder}
              className="h-12 w-full bg-transparent text-sm text-text outline-none placeholder:text-text-3"
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          <CommandList
            items={rendered}
            activeIndex={activeIndex}
            emptyMessage={emptyMessage}
            listRef={listRef}
            onSelect={selectAt}
            onHover={setActive}
          />

          <CommandFooter />
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
