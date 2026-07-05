import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { type ReactNode, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import { cn } from "@/shared/lib/utils";
import { Table } from "@/shared/ui/table";

import { SCROLL_WRAPPER_ID } from "./constants";
import { CustomizeColumns } from "./CustomizeColumns";
import { ExportButton } from "./ExportButton";
import { Filters } from "./filters/Filters";
import { useTablePrefs } from "./hooks/use-table-prefs";
import { SearchInput } from "./SearchInput";
import { createSelectColumn } from "./SelectColumn";
import { BaseTableBody } from "./TableBody";
import { BaseTableHeader } from "./TableHeader";

import type { FiltersProp } from "./types";
import type {
  ColumnDef,
  OnChangeFn,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table";

type BaseTableProps<TRow> = {
  columns: ColumnDef<TRow>[];
  data: TRow[];
  loading: boolean;
  error?: string;

  /** Infinite-scroll pagination (server-driven). */
  hasMore: boolean;
  onLoadMore: () => void;

  /** Server-side sorting — controlled by the caller (usually URL state). */
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;

  /** Optional search box in the toolbar (server-driven, debounced). */
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;

  /** Declarative filter panel (checkbox/radio) — caller maps values to its query. */
  filters?: FiltersProp;

  /** Stable id → persist column visibility + widths and show the Customize button. */
  tableId?: string;

  /** Row selection with a select column + a selection action bar. */
  enableSelection?: boolean;
  getRowId?: (row: TRow) => string;
  renderSelectionActions?: (selectedRows: TRow[], clearSelection: () => void) => ReactNode;

  /** Enables a CSV export button that downloads the loaded rows. */
  exportFileName?: string;

  /** Extra toolbar slots (left / right). */
  toolbarStart?: ReactNode;
  toolbarEnd?: ReactNode;

  onRowClick?: (row: TRow) => void;
  isRowDisabled?: (row: TRow) => boolean;
  rowTooltip?: string | ((row: TRow) => string);
  getRowClassName?: (row: TRow) => string | undefined;

  emptyMessage?: string;
  /** Height utility for the scroll area, e.g. "h-[calc(100vh-13rem)]". */
  className?: string;
  /** Unique scroll-container id when more than one table shares a page. */
  scrollId?: string;
};

/**
 * Reusable, server-driven table on @tanstack/react-table. Presentation only —
 * sorting/search/filters/pagination are controlled by the caller (a fetch hook +
 * URL state), so one implementation serves every feature. Opt-in extras:
 * `filters`, `tableId` (persisted visibility/width + customize), `enableSelection`,
 * and `exportFileName`. TanStack Table runs in manual mode; its column model
 * drives rendering, resizing, visibility, and selection.
 */
export function BaseTable<TRow>({
  columns,
  data,
  loading,
  error,
  hasMore,
  onLoadMore,
  sorting,
  onSortingChange,
  searchTerm,
  onSearchChange,
  searchPlaceholder,
  filters,
  tableId,
  enableSelection,
  getRowId,
  renderSelectionActions,
  exportFileName,
  toolbarStart,
  toolbarEnd,
  onRowClick,
  isRowDisabled,
  rowTooltip,
  getRowClassName,
  emptyMessage,
  className,
  scrollId = SCROLL_WRAPPER_ID,
}: BaseTableProps<TRow>) {
  const prefs = useTablePrefs(tableId);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const memoData = useMemo(() => data, [data]);
  const tableColumns = useMemo(
    () => (enableSelection ? [createSelectColumn<TRow>(), ...columns] : columns),
    [columns, enableSelection],
  );

  // eslint-disable-next-line react-hooks/incompatible-library -- useReactTable's returned functions are intentionally non-memoized; expected TanStack Table usage.
  const table = useReactTable({
    data: memoData,
    columns: tableColumns,
    state: {
      sorting,
      rowSelection,
      // Only control visibility/sizing when persisting, so an unpersisted table
      // still resizes/hides ephemerally via TanStack's internal state.
      ...(tableId
        ? { columnVisibility: prefs.columnVisibility, columnSizing: prefs.columnSizing }
        : {}),
    },
    onSortingChange,
    onRowSelectionChange: setRowSelection,
    ...(tableId
      ? {
          onColumnVisibilityChange: prefs.onColumnVisibilityChange,
          onColumnSizingChange: prefs.onColumnSizingChange,
        }
      : {}),
    getRowId,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    enableMultiSort: false,
    enableRowSelection: enableSelection ?? false,
    enableColumnResizing: true,
    columnResizeMode: "onEnd",
    defaultColumn: { minSize: 80, size: 180 },
  });

  const rows = table.getRowModel().rows;
  const selectedRows = enableSelection
    ? table.getSelectedRowModel().rows.map((row) => row.original)
    : [];

  const hasToolbar =
    filters || onSearchChange || exportFileName || tableId || toolbarStart || toolbarEnd;

  return (
    <div className="flex min-h-0 flex-col gap-3">
      {hasToolbar && (
        <div className="flex flex-wrap items-center gap-2">
          {filters && <Filters {...filters} />}
          {toolbarStart}
          <div className="ml-auto flex items-center gap-2">
            {onSearchChange && (
              <SearchInput
                value={searchTerm ?? ""}
                onChange={onSearchChange}
                placeholder={searchPlaceholder}
                className="w-64 max-w-full"
              />
            )}
            {tableId && <CustomizeColumns table={table} />}
            {exportFileName && (
              <ExportButton table={table} fileName={exportFileName} disabled={rows.length === 0} />
            )}
            {toolbarEnd}
          </div>
        </div>
      )}

      {enableSelection && selectedRows.length > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-accent/30 bg-accent-soft px-3 py-1.5 text-sm">
          <span className="font-medium text-accent">{selectedRows.length} selected</span>
          <div className="ml-auto flex items-center gap-2">
            {renderSelectionActions?.(selectedRows, () => table.resetRowSelection())}
            <button
              type="button"
              onClick={() => table.resetRowSelection()}
              className="text-xs text-text-3 hover:text-text"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      <div
        id={scrollId}
        className={cn("overflow-auto rounded-xl border border-border bg-panel", className)}
      >
        <InfiniteScroll
          dataLength={rows.length}
          hasMore={hasMore}
          next={onLoadMore}
          scrollableTarget={scrollId}
          scrollThreshold={0.9}
          style={{ overflow: "visible" }}
          loader={
            <div className="py-3 text-center text-xs text-text-3" aria-hidden>
              Loading more…
            </div>
          }
        >
          <Table style={{ width: table.getTotalSize() }} className="min-w-full">
            <BaseTableHeader headerGroups={table.getHeaderGroups()} />
            <BaseTableBody
              rows={rows}
              columnCount={tableColumns.length}
              loading={loading}
              error={error}
              emptyMessage={emptyMessage}
              onRowClick={onRowClick}
              isRowDisabled={isRowDisabled}
              rowTooltip={rowTooltip}
              getRowClassName={getRowClassName}
            />
          </Table>
        </InfiniteScroll>
      </div>
    </div>
  );
}
