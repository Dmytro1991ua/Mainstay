import { Filter } from "lucide-react";
import { useState } from "react";

import { Button } from "@/shared/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/shared/ui/dropdown-menu";

import { FilterGroup } from "./filter-group";
import { totalSelectedCount, toggleFilterValue } from "./utils";

import type { ActiveFilters, FilterConfig } from "./types";

type DataTableFiltersProps = {
  filterConfig: FilterConfig[];
  activeFilters: ActiveFilters;
  onFiltersChange: (filters: ActiveFilters) => void;
};

export const DataTableFilters = ({
  filterConfig,
  activeFilters,
  onFiltersChange,
}: DataTableFiltersProps) => {
  const [openFilterId, setOpenFilterId] = useState<string | null>(null);

  const total = totalSelectedCount(activeFilters);

  const handleChange = (configId: string, value: string, type: "single" | "multi") => {
    const current = activeFilters[configId] ?? [];

    onFiltersChange({ ...activeFilters, [configId]: toggleFilterValue(current, value, type) });
  };

  const handleClear = (configId: string) => {
    onFiltersChange({ ...activeFilters, [configId]: [] });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 border-accent bg-accent text-white hover:bg-accent/90 hover:text-white aria-expanded:bg-accent aria-expanded:text-white"
        >
          <Filter className="h-3.5 w-3.5" />
          Filters
          {total > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-semibold text-accent">
              {total}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-60 p-0"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {filterConfig.map((config) => (
          <FilterGroup
            key={config.id}
            config={config}
            selected={activeFilters[config.id] ?? []}
            isOpen={openFilterId === config.id}
            onToggle={() => setOpenFilterId((prev) => (prev === config.id ? null : config.id))}
            onChange={(value) => handleChange(config.id, value, config.type ?? "multi")}
            onClear={() => handleClear(config.id)}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
