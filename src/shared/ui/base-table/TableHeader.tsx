import { flexRender } from "@tanstack/react-table";

import { cn } from "@/shared/lib/utils";
import { TableHead, TableHeader as TableHeaderPrimitive, TableRow } from "@/shared/ui/table";

import { ColumnResizer } from "./ColumnResizer";
import { SortArrow } from "./SortArrow";

import type { HeaderGroup } from "@tanstack/react-table";

type BaseTableHeaderProps<TRow> = {
  headerGroups: HeaderGroup<TRow>[];
};

/**
 * Renders the sticky header. Each sortable header is click-to-sort (delegated to
 * TanStack's toggle handler) with a hover-revealed sort arrow, and carries a
 * ColumnResizer grip on its right edge. Widths come from `column.getSize()`.
 */
export function BaseTableHeader<TRow>({ headerGroups }: BaseTableHeaderProps<TRow>) {
  return (
    <TableHeaderPrimitive className="sticky top-0 z-10 bg-panel">
      {headerGroups.map((group) => (
        <TableRow key={group.id} className="hover:bg-transparent">
          {group.headers.map((header) => {
            const canSort = header.column.getCanSort();
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
                className={cn("group/th", canSort && "cursor-pointer select-none")}
                onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
              >
                {header.isPlaceholder ? null : (
                  <span className="flex items-center gap-1.5">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {canSort && <SortArrow direction={header.column.getIsSorted()} />}
                  </span>
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
