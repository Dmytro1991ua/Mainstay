import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { type ReactNode, useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import { cn } from "@/shared/lib/utils";
import { Table } from "@/shared/ui/table";

import { SCROLL_WRAPPER_ID } from "./constants";
import { SearchInput } from "./SearchInput";
import { BaseTableBody } from "./TableBody";
import { BaseTableHeader } from "./TableHeader";

import type { ColumnDef, OnChangeFn, SortingState } from "@tanstack/react-table";

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

  /** Toolbar slots for future filters / export / customize-columns. */
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
 * Reusable, server-driven table built on @tanstack/react-table. It owns
 * presentation only — sorting/search/pagination are controlled by the caller (a
 * fetch hook + URL state), so it stays feature-agnostic and every table shares
 * this one implementation. TanStack Table runs in manual mode (the server does
 * the sorting/filtering/paging); the column model here is just for rendering,
 * resizing, and (later) visibility/selection.
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
  const memoData = useMemo(() => data, [data]);
  const memoColumns = useMemo(() => columns, [columns]);

  // eslint-disable-next-line react-hooks/incompatible-library -- useReactTable's returned functions are intentionally non-memoized; this is expected TanStack Table usage.
  const table = useReactTable({
    data: memoData,
    columns: memoColumns,
    state: { sorting },
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    enableMultiSort: false,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    defaultColumn: { minSize: 80, size: 180 },
  });

  const rows = table.getRowModel().rows;
  const hasToolbar = onSearchChange || toolbarStart || toolbarEnd;

  return (
    <div className="flex min-h-0 flex-col gap-3">
      {hasToolbar && (
        <div className="flex flex-wrap items-center gap-2">
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
            {toolbarEnd}
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
              columnCount={columns.length}
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
