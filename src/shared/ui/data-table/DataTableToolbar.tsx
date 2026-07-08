import { type Table } from "@tanstack/react-table";
import { Search } from "lucide-react";
import { type ReactNode } from "react";

import { Input } from "@/shared/ui/input";

import { ColumnVisibilityMenu } from "./ColumnVisibilityMenu";
import { DataTableFilters } from "./DataTableFilters";
import { ExportButton } from "./export-button";

import type { ActiveFilters, FilterConfig } from "./types";

type DataTableToolbarProps<TData> = {
  table: Table<TData>;
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filterConfig?: FilterConfig[];
  activeFilters: ActiveFilters;
  onFiltersChange: (filters: ActiveFilters) => void;
  exportFilename?: string;
  enableColumnVisibility?: boolean;
  actions?: ReactNode;
};

export const DataTableToolbar = <TData,>({
  table,
  search,
  onSearchChange,
  searchPlaceholder = "Search...",
  filterConfig,
  activeFilters,
  onFiltersChange,
  exportFilename,
  enableColumnVisibility = true,
  actions,
}: DataTableToolbarProps<TData>) => {
  return (
    <div className="flex items-center justify-between gap-3 pb-3">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-text-3" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-9"
          />
        </div>
        {filterConfig && filterConfig.length > 0 && (
          <DataTableFilters
            filterConfig={filterConfig}
            activeFilters={activeFilters}
            onFiltersChange={onFiltersChange}
          />
        )}
      </div>
      <div className="flex items-center gap-2">
        {actions}
        {enableColumnVisibility && <ColumnVisibilityMenu table={table} />}
        {exportFilename && <ExportButton table={table} filename={exportFilename} />}
      </div>
    </div>
  );
};
