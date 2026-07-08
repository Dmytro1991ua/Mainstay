import { flexRender, type Table } from "@tanstack/react-table";
import { AlertTriangle, Inbox } from "lucide-react";
import { type KeyboardEvent, type ReactNode } from "react";

import { cn } from "@/shared/lib/utils";
import { EmptyState } from "@/shared/ui/empty-state";

import { DataTableSkeleton } from "./DataTableSkeleton";

import type { RowHighlightInfo } from "./types";

type DataTableBodyProps<TData> = {
  table: Table<TData>;
  isPending?: boolean;
  isError?: boolean;
  emptyState?: ReactNode;
  errorState?: ReactNode;
  onRowClick?: (row: TData) => void;
  getRowHighlightInfo?: (rowOriginal: TData) => RowHighlightInfo;
  isRowDisabled?: (rowOriginal: TData) => boolean;
  rowTooltipMessage?: string | ((rowOriginal: TData) => string);
};

const onRowKeyDown = <TData,>(e: KeyboardEvent, row: TData, handler: (row: TData) => void) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();

    handler(row);
  }
};

export const DataTableBody = <TData,>({
  table,
  isPending,
  isError,
  emptyState,
  errorState,
  onRowClick,
  getRowHighlightInfo,
  isRowDisabled,
  rowTooltipMessage,
}: DataTableBodyProps<TData>) => {
  const colCount = table.getVisibleLeafColumns().length;

  if (isPending) {
    return <DataTableSkeleton colCount={colCount} />;
  }

  if (isError) {
    return (
      <tbody>
        <tr>
          <td colSpan={colCount} className="py-6 text-center">
            {errorState ?? (
              <EmptyState
                icon={AlertTriangle}
                message="Failed to load data."
                description="Try refreshing the page."
                variant="red"
              />
            )}
          </td>
        </tr>
      </tbody>
    );
  }

  const rows = table.getRowModel().rows;

  if (!rows.length) {
    return (
      <tbody>
        <tr>
          <td colSpan={colCount} className="py-6 text-center">
            {emptyState ?? <EmptyState icon={Inbox} message="No data found." />}
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {rows.map((row) => (
        <tr
          key={row.id}
          data-selected={row.getIsSelected()}
          onClick={onRowClick ? () => onRowClick(row.original) : undefined}
          onKeyDown={onRowClick ? (e) => onRowKeyDown(e, row.original, onRowClick) : undefined}
          tabIndex={onRowClick ? 0 : undefined}
          title={
            typeof rowTooltipMessage === "string"
              ? rowTooltipMessage
              : rowTooltipMessage?.(row.original)
          }
          className={cn(
            "border-b border-border transition-colors last:border-0",
            onRowClick &&
              "cursor-pointer hover:bg-panel-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
            row.getIsSelected() && "bg-accent/5",
            isRowDisabled?.(row.original) && "cursor-not-allowed opacity-40",
            getRowHighlightInfo?.(row.original).isHighlighted &&
              getRowHighlightInfo(row.original).highlightStyles,
          )}
        >
          {row.getVisibleCells().map((cell) => (
            <td
              key={cell.id}
              style={{ width: cell.column.getSize() }}
              className="px-3 py-3 text-sm text-text"
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};
