import { Check } from "lucide-react";

import { cn } from "@/shared/lib/utils";

import type { FilterType } from "../types";

type FilterOptionProps = {
  type: FilterType;
  label: string;
  checked: boolean;
  onSelect: () => void;
};

/**
 * One selectable option row inside a filter group. The whole row is the control;
 * the indicator is a square (checkbox, multi-select) or a dot (radio, single-
 * select). Purely visual indicator — the row button owns the interaction.
 */
export function FilterOption({ type, label, checked, onSelect }: FilterOptionProps) {
  return (
    <button
      type="button"
      role={type === "radio" ? "radio" : "checkbox"}
      aria-checked={checked}
      onClick={onSelect}
      className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm text-text-2 hover:bg-panel-2"
    >
      {type === "checkbox" ? (
        <span
          className={cn(
            "flex size-4 shrink-0 items-center justify-center rounded-[5px] border",
            checked ? "border-accent bg-accent text-white" : "border-border",
          )}
        >
          {checked && <Check className="size-3" />}
        </span>
      ) : (
        <span
          className={cn(
            "flex size-4 shrink-0 items-center justify-center rounded-full border",
            checked ? "border-accent" : "border-border",
          )}
        >
          {checked && <span className="size-2 rounded-full bg-accent" />}
        </span>
      )}
      <span className="flex-1 truncate">{label}</span>
    </button>
  );
}
