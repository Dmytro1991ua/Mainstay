import {
  type KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { orderCommandItems } from "./command-menu.utils";

import type { CommandItem } from "./command-menu.types";

type UseCommandListParams = {
  items: CommandItem[];
  onClose: () => void;
};

/**
 * Owns all command-list behaviour — query, the filtered+grouped ordering, the
 * keyboard cursor, scroll-into-view, and selection — so the component stays
 * purely presentational.
 *
 * The cursor is clamped to the current result length so a shrinking result set
 * can never leave it pointing past the end, and it resets inside event handlers
 * (never in an effect) to respect the React 19 "no setState during effects" rule.
 */
export const useCommandList = ({ items, onClose }: UseCommandListParams) => {
  const [query, setQueryValue] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const rendered = useMemo(() => orderCommandItems(items, query), [items, query]);
  const activeIndex = rendered.length ? Math.min(active, rendered.length - 1) : 0;

  // Keep the active row scrolled into view as the user arrows through. (The list
  // is unmounted while the dialog is closed, so `listRef.current` is null then.)
  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const setQuery = (value: string) => {
    setQueryValue(value);
    setActive(0);
  };

  const reset = () => {
    setQueryValue("");
    setActive(0);
  };

  const selectAt = (index: number) => {
    const item = rendered[index];
    if (!item) return;
    onClose();
    item.onSelect();
  };

  const onKeyDown = (event: ReactKeyboardEvent) => {
    if (rendered.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((a) => (a + 1) % rendered.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((a) => (a - 1 + rendered.length) % rendered.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      selectAt(activeIndex);
    }
  };

  return {
    query,
    setQuery,
    reset,
    rendered,
    activeIndex,
    setActive,
    selectAt,
    onKeyDown,
    listRef,
  };
};
