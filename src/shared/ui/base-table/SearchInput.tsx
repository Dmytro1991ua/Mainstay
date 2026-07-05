import { Search, X } from "lucide-react";
import { useState } from "react";

import { useDebouncedCallback } from "@/shared/hooks/use-debounced-callback";
import { cn } from "@/shared/lib/utils";

import { SEARCH_DEBOUNCE_MS } from "./constants";

type SearchInputProps = {
  /** The committed (URL/server) value — keeps the box in sync on back/forward. */
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

/**
 * Search box whose keystrokes stay instant (local state) but only reach the
 * server after a debounce. `value` is the committed term, so external changes
 * (e.g. browser back) re-sync the field.
 */
export function SearchInput({ value, onChange, placeholder = "Search…", className }: SearchInputProps) {
  const [local, setLocal] = useState(value);
  const [committed, setCommitted] = useState(value);
  const debouncedOnChange = useDebouncedCallback(onChange, SEARCH_DEBOUNCE_MS);

  // Re-sync to the committed (URL) value when it changes from OUTSIDE — e.g.
  // browser back/forward — without an effect (React's adjust-state-in-render).
  if (value !== committed) {
    setCommitted(value);
    setLocal(value);
  }

  const commit = (next: string) => {
    setLocal(next);
    debouncedOnChange(next);
  };

  return (
    <div
      className={cn(
        "flex h-8 items-center gap-2 rounded-lg border border-border bg-panel-2 px-2.5",
        "focus-within:border-accent",
        className,
      )}
    >
      <Search className="h-4 w-4 shrink-0 text-text-3" />
      <input
        value={local}
        onChange={(e) => commit(e.target.value)}
        placeholder={placeholder}
        className="h-full w-full bg-transparent text-sm text-text outline-none placeholder:text-text-3"
        autoComplete="off"
        spellCheck={false}
        aria-label={placeholder}
      />
      {local && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => {
            setLocal("");
            debouncedOnChange.cancel();
            onChange("");
          }}
          className="text-text-3 hover:text-text"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
