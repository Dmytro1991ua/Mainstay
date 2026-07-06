import { Checkbox } from "@/shared/ui/checkbox";

import type { ColumnDef } from "@tanstack/react-table";

/**
 * Leading selection column: a tri-state select-all in the header and a per-row
 * checkbox in each cell, both wired to the TanStack selection API. Non-sortable,
 * non-hideable, non-resizable, fixed width. Row clicks on the checkbox are
 * stopped so they don't also trigger the row's onRowClick.
 */
export function createSelectColumn<TRow>(): ColumnDef<TRow> {
  return {
    id: "select",
    size: 44,
    enableSorting: false,
    enableHiding: false,
    enableResizing: false,
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all loaded rows"
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomePageRowsSelected()
              ? "indeterminate"
              : false
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label="Select row"
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        onClick={(e) => e.stopPropagation()}
      />
    ),
  };
}
