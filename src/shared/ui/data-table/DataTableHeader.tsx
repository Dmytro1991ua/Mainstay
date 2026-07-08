import { flexRender, type Header, type Table } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { type KeyboardEvent } from "react";

import { cn } from "@/shared/lib/utils";

import { columnLabel } from "./utils";

const MIN_COL_SIZE = 40;

type DataTableHeaderProps<TData> = {
  table: Table<TData>;
  enableColumnResizing?: boolean;
};

const SortIcon = ({ sorted }: { sorted: false | "asc" | "desc" }) => {
  if (sorted === "asc") return <ArrowUp className="ml-1.5 h-3.5 w-3.5 shrink-0" />;
  if (sorted === "desc") return <ArrowDown className="ml-1.5 h-3.5 w-3.5 shrink-0" />;
  return <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 shrink-0 opacity-40" />;
};

const makeResizeKeyHandler =
  <TData,>(header: Header<TData, unknown>, table: Table<TData>) =>
  (e: KeyboardEvent) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const delta = e.key === "ArrowLeft" ? -10 : 10;
    table.setColumnSizing((prev) => ({
      ...prev,
      [header.column.id]: Math.max(MIN_COL_SIZE, header.column.getSize() + delta),
    }));
  };

const HeaderCellContent = <TData,>({ header }: { header: Header<TData, unknown> }) => {
  if (header.isPlaceholder) return null;

  const canSort = header.column.getCanSort();
  const content = flexRender(header.column.columnDef.header, header.getContext());

  if (canSort) {
    return (
      <button
        type="button"
        className="flex w-full cursor-pointer select-none items-center bg-transparent p-0 text-inherit hover:text-text"
        onClick={header.column.getToggleSortingHandler()}
      >
        {content}
        <SortIcon sorted={header.column.getIsSorted()} />
      </button>
    );
  }

  return <span className="flex items-center">{content}</span>;
};

export const DataTableHeader = <TData,>({
  table,
  enableColumnResizing,
}: DataTableHeaderProps<TData>) => (
  <thead>
    {table.getHeaderGroups().map((headerGroup) => (
      <tr key={headerGroup.id}>
        {headerGroup.headers.map((header) => {
          const canResize = enableColumnResizing && header.column.getCanResize();

          return (
            <th
              key={header.id}
              colSpan={header.colSpan}
              style={{ width: header.getSize() }}
              className={cn(
                "relative border-b border-border bg-panel-2 py-2.5 text-xs font-medium tracking-wide text-text-3 uppercase",
                (header.column.columnDef.meta as { headerClassName?: string } | undefined)
                  ?.headerClassName ?? "px-3 text-left",
              )}
            >
              <HeaderCellContent header={header} />

              {canResize && (
                <button
                  type="button"
                  aria-label={`Resize ${columnLabel(header.column)} column`}
                  onMouseDown={header.getResizeHandler()}
                  onTouchStart={header.getResizeHandler()}
                  onKeyDown={makeResizeKeyHandler(header, table)}
                  className={cn(
                    "absolute top-0 right-0 h-full w-1 cursor-col-resize touch-none select-none outline-none",
                    "hover:bg-accent/40 focus-visible:bg-accent/40",
                    header.column.getIsResizing() && "bg-accent",
                  )}
                />
              )}
            </th>
          );
        })}
      </tr>
    ))}
  </thead>
);
