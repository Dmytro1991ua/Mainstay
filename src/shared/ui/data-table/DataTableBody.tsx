import { flexRender, type Table } from "@tanstack/react-table";
import { type KeyboardEvent } from "react";

import { cn } from "@/shared/lib/utils";

import type { RowHighlightInfo } from "./types";

type DataTableBodyProps<TData> = {
  table: Table<TData>;
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
  onRowClick,
  getRowHighlightInfo,
  isRowDisabled,
  rowTooltipMessage,
}: DataTableBodyProps<TData>) => {
  "use no memo";
  return (
    <tbody>
      {table.getRowModel().rows.map((row) => (
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
            "group border-b border-border transition-colors last:border-0",
            getRowHighlightInfo?.(row.original).isHighlighted &&
              getRowHighlightInfo(row.original).highlightStyles,
            onRowClick &&
              "cursor-pointer hover:bg-accent/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
            row.getIsSelected() && "bg-accent/5",
            isRowDisabled?.(row.original) && "cursor-not-allowed opacity-40",
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
