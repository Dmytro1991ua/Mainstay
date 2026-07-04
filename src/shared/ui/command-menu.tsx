import { CornerDownLeft, type LucideIcon, Search } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/shared/lib/utils";

export type CommandItem = {
  /** Stable unique id (used for keys + scroll-into-view targeting). */
  id: string;
  label: string;
  /** Heading this item is bucketed under (e.g. "Navigation", "Actions"). */
  group: string;
  icon?: LucideIcon;
  /** Small muted text on the right (e.g. "Jump to"). */
  hint?: string;
  /** Extra text folded into the search match but not shown. */
  keywords?: string;
  onSelect: () => void;
};

type CommandMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CommandItem[];
  placeholder?: string;
  emptyMessage?: string;
};

const normalize = (s: string) => s.toLowerCase().trim();

/**
 * Dependency-free command palette (no `cmdk`) built on the Radix Dialog for its
 * focus trap, Esc handling, and a11y. Filtering + grouping + keyboard navigation
 * are handled here so the render order and the active-index cursor stay in lock
 * step. Purely presentational: it knows nothing about routes or auth — callers
 * pass in `items` with their own `onSelect`, which keeps it reusable and lets the
 * searchable set grow (inventory, tasks, …) without touching this file.
 */
export function CommandMenu({
  open,
  onOpenChange,
  items,
  placeholder = "Search pages and actions…",
  emptyMessage = "No results found.",
}: CommandMenuProps) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Filter (preserving source order), then lay items out grouped — with the flat
  // `rendered` array following the exact on-screen order so `active` indexes it 1:1.
  const rendered = useMemo(() => {
    const q = normalize(query);
    const filtered = q
      ? items.filter((it) => normalize(`${it.label} ${it.keywords ?? ""} ${it.group}`).includes(q))
      : items;

    const groupOrder: string[] = [];
    for (const it of filtered) if (!groupOrder.includes(it.group)) groupOrder.push(it.group);

    return groupOrder.flatMap((group) => filtered.filter((it) => it.group === group));
  }, [items, query]);

  // Clamp so a shrinking result set (e.g. roles loading in) can never leave the
  // cursor pointing past the end.
  const activeIndex = rendered.length ? Math.min(active, rendered.length - 1) : 0;

  // Keep the active row scrolled into view as the user arrows through.
  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  const runSelect = (index: number) => {
    const item = rendered[index];
    if (!item) return;
    onOpenChange(false);
    item.onSelect();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (rendered.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % rendered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a - 1 + rendered.length) % rendered.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      runSelect(activeIndex);
    }
  };

  // Track the group boundaries so we can render a heading before each new group.
  let lastGroup: string | null = null;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            setQuery("");
            setActive(0);
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
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={onKeyDown}
              placeholder={placeholder}
              className="h-12 w-full bg-transparent text-sm text-text outline-none placeholder:text-text-3"
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          <div ref={listRef} className="max-h-[52vh] overflow-y-auto p-2">
            {rendered.length === 0 ? (
              <p className="px-2 py-6 text-center text-sm text-text-3">{emptyMessage}</p>
            ) : (
              rendered.map((item, index) => {
                const showHeading = item.group !== lastGroup;
                lastGroup = item.group;
                const Icon = item.icon;
                const isActive = index === activeIndex;
                return (
                  <div key={item.id}>
                    {showHeading && (
                      <div className="px-2 pt-2 pb-1 text-[11px] font-medium tracking-wide text-text-3 uppercase">
                        {item.group}
                      </div>
                    )}
                    <button
                      type="button"
                      data-index={index}
                      onMouseMove={() => setActive(index)}
                      onClick={() => runSelect(index)}
                      className={cn(
                        "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm outline-none",
                        isActive ? "bg-panel-2 text-text" : "text-text-2",
                      )}
                    >
                      {Icon && (
                        <Icon
                          className={cn(
                            "h-4 w-4 shrink-0",
                            isActive ? "text-text-2" : "text-text-3",
                          )}
                        />
                      )}
                      <span className="min-w-0 flex-1 truncate">{item.label}</span>
                      {item.hint && (
                        <span className="shrink-0 text-xs text-text-3">{item.hint}</span>
                      )}
                    </button>
                  </div>
                );
              })
            )}
          </div>

          <div className="flex items-center gap-4 border-t border-border px-4 py-2 text-[11px] text-text-3">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-border bg-panel-2 px-1">↑</kbd>
              <kbd className="rounded border border-border bg-panel-2 px-1">↓</kbd>
              navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-border bg-panel-2 px-1">
                <CornerDownLeft className="h-3 w-3" />
              </kbd>
              select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-border bg-panel-2 px-1">esc</kbd>
              close
            </span>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
