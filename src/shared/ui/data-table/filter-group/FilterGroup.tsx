import { ChevronDown, ChevronRight } from "lucide-react";

import { cn } from "@/shared/lib/utils";

import { FilterGroupOption } from "./FilterGroupOption";

import type { FilterConfig } from "../types";

export type FilterGroupProps = {
  config: FilterConfig;
  selected: string[];
  isOpen: boolean;
  onToggle: () => void;
  onChange: (value: string) => void;
  onClear: () => void;
};

export const FilterGroup = ({
  config,
  selected,
  isOpen,
  onToggle,
  onChange,
  onClear,
}: FilterGroupProps) => {
  const type = config.type ?? "multi";
  const count = selected.length;
  const Chevron = isOpen ? ChevronDown : ChevronRight;

  return (
    <div className="border-b border-border last:border-0">
      <div className="flex items-center hover:bg-panel-2">
        <button
          type="button"
          className="flex flex-1 items-center gap-2 px-3 py-2.5 text-sm"
          onClick={onToggle}
        >
          <Chevron className="h-3.5 w-3.5 shrink-0 text-text-3" />
          <span className="font-medium text-text">{config.label}</span>
          {count > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-white">
              {count}
            </span>
          )}
        </button>
        <button
          type="button"
          className={cn(
            "pr-3 text-xs font-medium text-accent hover:text-accent/70",
            count === 0 && "invisible",
          )}
          disabled={count === 0}
          onClick={onClear}
        >
          Clear
        </button>
      </div>
      {isOpen && (
        <div className="max-h-56 overflow-y-auto px-3 pb-2">
          {config.options.map((opt) => (
            <FilterGroupOption
              key={opt.value}
              option={opt}
              isSelected={selected.includes(opt.value)}
              type={type}
              onChange={onChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};
