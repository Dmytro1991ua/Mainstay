import { cn } from "@/shared/lib/utils";

import type { CommandItem } from "./types";

type CommandItemRowProps = {
  item: CommandItem;
  /** Position in the flat rendered list — mirrors the keyboard cursor. */
  index: number;
  active: boolean;
  onSelect: () => void;
  onHover: () => void;
};

/** A single selectable row in the command palette. Presentational only. */
export function CommandItemRow({ item, index, active, onSelect, onHover }: CommandItemRowProps) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      data-index={index}
      onMouseMove={onHover}
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm outline-none",
        active ? "bg-panel-2 text-text" : "text-text-2",
      )}
    >
      {Icon && <Icon className={cn("h-4 w-4 shrink-0", active ? "text-text-2" : "text-text-3")} />}
      <span className="min-w-0 flex-1 truncate">{item.label}</span>
      {item.hint && <span className="shrink-0 text-xs text-text-3">{item.hint}</span>}
    </button>
  );
}
