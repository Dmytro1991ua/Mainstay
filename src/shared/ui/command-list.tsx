import { CommandItemRow } from "./command-menu-item";

import type { CommandItem } from "./command-menu.types";
import type { RefObject } from "react";

type CommandListProps = {
  /** Items in final on-screen order (already filtered + grouped). */
  items: CommandItem[];
  activeIndex: number;
  emptyMessage: string;
  listRef: RefObject<HTMLDivElement | null>;
  onSelect: (index: number) => void;
  onHover: (index: number) => void;
};

/**
 * The palette's scrollable results region: the empty state, group headings, and
 * the rows. A heading is shown wherever an item's group differs from the one
 * before it — the items arrive already grouped, so that boundary check is enough.
 */
export function CommandList({
  items,
  activeIndex,
  emptyMessage,
  listRef,
  onSelect,
  onHover,
}: CommandListProps) {
  return (
    <div ref={listRef} className="max-h-[52vh] overflow-y-auto p-2">
      {items.length === 0 ? (
        <p className="px-2 py-6 text-center text-sm text-text-3">{emptyMessage}</p>
      ) : (
        items.map((item, index) => {
          const showHeading = index === 0 || items[index - 1].group !== item.group;
          return (
            <div key={item.id}>
              {showHeading && (
                <div className="px-2 pt-2 pb-1 text-[11px] font-medium tracking-wide text-text-3 uppercase">
                  {item.group}
                </div>
              )}
              <CommandItemRow
                item={item}
                index={index}
                active={index === activeIndex}
                onSelect={() => onSelect(index)}
                onHover={() => onHover(index)}
              />
            </div>
          );
        })
      )}
    </div>
  );
}
