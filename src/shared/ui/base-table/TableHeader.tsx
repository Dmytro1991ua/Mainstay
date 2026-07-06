import { flexRender } from "@tanstack/react-table";

import { TableHead, TableHeader as TableHeaderPrimitive, TableRow } from "@/shared/ui/table";

import { ColumnResizer } from "./ColumnResizer";
import { SortArrow } from "./SortArrow";

import type { HeaderGroup } from "@tanstack/react-table";

type BaseTableHeaderProps<TRow> = {
  headerGroups: HeaderGroup<TRow>[];
};

/**
 * Renders the sticky header. Sortable headers are a real <button> (keyboard-
 * operable — Enter/Space toggle sort, focusable in tab order) carrying a
 * hover-revealed sort arrow; `aria-sort` on the cell announces the current
 * direction. Each header also has a ColumnResizer grip on its right edge.
 * Widths come from `column.getSize()`.
 */
export function BaseTableHeader<TRow>({ headerGroups }: BaseTableHeaderProps<TRow>) {
  return (
    <TableHeaderPrimitive className="sticky top-0 z-10 bg-panel">
      {headerGroups.map((group) => (
        <TableRow key={group.id} className="hover:bg-transparent">
          {group.headers.map((header) => {
            const canSort = header.column.getCanSort();
            const label = header.isPlaceholder
              ? null
              : flexRender(header.column.columnDef.header, header.getContext());
            return (
              <TableHead
                key={header.id}
                style={{ width: header.getSize() }}
                aria-sort={
                  header.column.getIsSorted() === "asc"
                    ? "ascending"
                    : header.column.getIsSorted() === "desc"
                      ? "descending"
                      : undefined
                }
                className="group/th"
              >
                {canSort ? (
                  <button
                    type="button"
                    onClick={header.column.getToggleSortingHandler()}
                    className="flex items-center gap-1.5 rounded-sm outline-none select-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    {label}
                    <SortArrow direction={header.column.getIsSorted()} />
                  </button>
                ) : (
                  <span className="flex items-center gap-1.5">{label}</span>
                )}
                <ColumnResizer header={header} />
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </TableHeaderPrimitive>
  );
}
