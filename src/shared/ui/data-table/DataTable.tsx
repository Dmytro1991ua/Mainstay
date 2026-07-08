import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import { DataTableBody } from "./DataTableBody";
import { DataTableFetchRows } from "./DataTableFetchRows";
import { DataTableHeader } from "./DataTableHeader";
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
  isFetchingNextPage,
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
  maxHeight = "600px",
  enableRowSelection = false,
  enableColumnVisibility = true,
  enableColumnResizing = true,
  enableSorting = true,
}: DataTableProps<TData>) => {
  const [scrollContainer, setScrollContainer] = useState<HTMLDivElement | null>(null);

  const { search, setSearch } = useSearchInTable({ tableState, onSetTableState });
  const { activeFilters, setFilters } = useFiltersInTable({ tableState, onSetTableState });

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

  const colCount = table.getVisibleLeafColumns().length;

  return (
    <div className="flex flex-col">
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
      />

      <div
        ref={setScrollContainer}
        className="overflow-auto rounded-lg border border-border"
        style={{ maxHeight }}
      >
        <InfiniteScroll
          dataLength={data.length}
          next={fetchNextPage ?? (() => {})}
          hasMore={hasNextPage ?? false}
          loader={<DataTableFetchRows colCount={colCount} rowCount={3} />}
          scrollableTarget={scrollContainer}
        >
          <table className="w-full min-w-max border-collapse text-sm">
            <DataTableHeader table={table} enableColumnResizing={enableColumnResizing} />
            <DataTableBody
              table={table}
              isPending={isPending}
              isError={isError}
              emptyState={emptyState}
              errorState={errorState}
              onRowClick={onRowClick}
              getRowHighlightInfo={getRowHighlightInfo}
              isRowDisabled={isRowDisabled}
              rowTooltipMessage={rowTooltipMessage}
            />
          </table>
          {isFetchingNextPage && <DataTableFetchRows colCount={colCount} border="top" />}
        </InfiniteScroll>
      </div>
    </div>
  );
};
