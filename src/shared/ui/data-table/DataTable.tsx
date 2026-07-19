import { useRef } from "react";

import { useScrolled } from "@/shared/hooks/use-scrolled";

import { DataTableContent } from "./DataTableContent";
import { DataTableToolbar } from "./DataTableToolbar";
import { useFiltersInTable } from "./hooks/use-filters-in-table";
import { useSearchInTable } from "./hooks/use-search-in-table";
import { useTableState } from "./hooks/use-table-state";

import type { DataTableProps } from "./types";

export const DataTable = <TData,>({
  columns,
  data,
  tableId,
  isPending,
  isError,
  hasNextPage,
  fetchNextPage,
  searchPlaceholder,
  filterConfig,
  exportFilename,
  actions,
  emptyState,
  errorState,
  onRowClick,
  getRowId,
  getRowHighlightInfo,
  isRowDisabled,
  rowTooltipMessage,
  tableState,
  onSetTableState,
  onSelectionChange,
  maxHeight,
  enableRowSelection = false,
  enableColumnVisibility = true,
  enableColumnResizing = true,
  enableSorting = true,
  hideSearch = false,
}: DataTableProps<TData>) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isScrolled = useScrolled(scrollRef);

  const { search, setSearch } = useSearchInTable({ tableState, onSetTableState });
  const { activeFilters, setFilters } = useFiltersInTable({ tableState, onSetTableState });

  const scrollContainerId = `${tableId}-scroll`;

  const { table } = useTableState({
    columns,
    data,
    tableId,
    enableRowSelection,
    enableColumnResizing,
    enableSorting,
    getRowId,
    tableState,
    onSetTableState,
    onSelectionChange,
  });

  const isDisabled = isPending || isError;

  return (
    <div className="flex flex-1 flex-col min-h-0">
      <DataTableToolbar
        table={table}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder={searchPlaceholder}
        filterConfig={filterConfig}
        activeFilters={activeFilters}
        onFiltersChange={setFilters}
        exportFilename={exportFilename}
        enableColumnVisibility={enableColumnVisibility}
        actions={actions}
        disabled={isDisabled}
        hideSearch={hideSearch}
      />

      <div
        ref={scrollRef}
        id={scrollContainerId}
        className="flex flex-col flex-1 min-h-0 overflow-auto rounded-lg border border-border"
        style={maxHeight ? { maxHeight } : undefined}
      >
        <DataTableContent
          table={table}
          data={data}
          isPending={isPending}
          isError={isError}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          scrollContainerId={scrollContainerId}
          enableColumnResizing={enableColumnResizing}
          isScrolled={isScrolled}
          emptyState={emptyState}
          errorState={errorState}
          onRowClick={onRowClick}
          getRowHighlightInfo={getRowHighlightInfo}
          isRowDisabled={isRowDisabled}
          rowTooltipMessage={rowTooltipMessage}
        />
      </div>
    </div>
  );
};
