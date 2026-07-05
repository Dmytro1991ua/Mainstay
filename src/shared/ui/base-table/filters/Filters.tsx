import { ListFilter } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";

import { FilterOption } from "./FilterOption";

import type { FiltersProp } from "../types";

/** Total number of selected values across all filter dimensions. */
const countSelected = (values: FiltersProp["values"]) =>
  Object.values(values).reduce((sum, list) => sum + list.length, 0);

/**
 * Declarative filter panel: a "Filters (n)" popover whose contents are driven
 * entirely by `config`. Each dimension renders as a labeled group of checkbox
 * (multi) or radio (single) options. Feature-agnostic — the caller maps the
 * chosen values onto its own query/URL params.
 */
export function Filters({ config, values, onToggle, onClear, onClearAll }: FiltersProp) {
  if (config.length === 0) return null;
  const total = countSelected(values);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" aria-label="Filters">
          <ListFilter />
          Filters
          {total > 0 && (
            <span className="ml-0.5 rounded-full bg-accent px-1.5 text-[11px] leading-4 text-white">
              {total}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72">
        <div className="flex items-center justify-between px-1 pb-1.5">
          <span className="text-xs font-medium tracking-wide text-text-3 uppercase">Filters</span>
          {total > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs text-accent hover:underline"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {config.map((dimension) => {
            const selected = values[dimension.key] ?? [];
            return (
              <div key={dimension.key}>
                <div className="flex items-center justify-between px-2 pb-0.5">
                  <span className="text-xs font-medium text-text-2">{dimension.label}</span>
                  {selected.length > 0 && (
                    <button
                      type="button"
                      onClick={() => onClear(dimension.key)}
                      className={cn("text-[11px] text-text-3 hover:text-text")}
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div role={dimension.type === "radio" ? "radiogroup" : "group"}>
                  {dimension.options.map((option) => (
                    <FilterOption
                      key={option.value}
                      type={dimension.type}
                      label={option.label}
                      checked={selected.includes(option.value)}
                      onSelect={() => onToggle(dimension.key, option.value, dimension.type)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
