import { flexRender } from "@tanstack/react-table";

import { cn } from "@/shared/lib/utils";
import { TableBody as TableBodyPrimitive, TableCell, TableRow } from "@/shared/ui/table";

import { getTableStatusContent } from "./utils";

import type { Row } from "@tanstack/react-table";

type BaseTableBodyProps<TRow> = {
  rows: Row<TRow>[];
  columnCount: number;
  loading: boolean;
  error?: string;
  emptyMessage?: string;
  onRowClick?: (row: TRow) => void;
  isRowDisabled?: (row: TRow) => boolean;
  rowTooltip?: string | ((row: TRow) => string);
  /** Extra className for a row, e.g. status highlight (green/red/amber tints). */
  getRowClassName?: (row: TRow) => string | undefined;
};

/**
 * Renders the data rows, or a single full-width status cell (loading / error /
 * empty) when there are none. Row clicks are suppressed while the user has a text
 * selection or the row is disabled.
 */
export function BaseTableBody<TRow>({
  rows,
  columnCount,
  loading,
  error,
  emptyMessage,
  onRowClick,
  isRowDisabled,
  rowTooltip,
  getRowClassName,
}: BaseTableBodyProps<TRow>) {
  const status = getTableStatusContent({ loading, error, isEmpty: rows.length === 0, emptyMessage });

  if (status) {
    return (
      <TableBodyPrimitive>
        <TableRow className="hover:bg-transparent">
          <TableCell colSpan={columnCount}>{status}</TableCell>
        </TableRow>
      </TableBodyPrimitive>
    );
  }

  return (
    <TableBodyPrimitive>
      {rows.map((row) => {
        const original = row.original;
        const disabled = isRowDisabled?.(original) ?? false;
        const tooltip = typeof rowTooltip === "function" ? rowTooltip(original) : rowTooltip;

        return (
          <TableRow
            key={row.id}
            title={tooltip}
            data-state={row.getIsSelected() ? "selected" : undefined}
            className={cn(
              onRowClick && !disabled && "cursor-pointer",
              disabled && "pointer-events-none opacity-50",
              getRowClassName?.(original),
            )}
            onClick={() => {
              if (disabled || !onRowClick) return;
              if (window.getSelection()?.toString()) return; // don't hijack text selection
              onRowClick(original);
            }}
          >
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id} style={{ width: cell.column.getSize() }}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        );
      })}
    </TableBodyPrimitive>
  );
}
