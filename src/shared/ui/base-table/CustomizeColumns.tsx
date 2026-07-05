import { Check, SlidersHorizontal } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";

import type { Column, Table } from "@tanstack/react-table";

/** Human label for a column: its string header, else a title-cased id. */
const columnLabel = <TRow,>(column: Column<TRow, unknown>) => {
  const header = column.columnDef.header;
  if (typeof header === "string") return header;
  return column.id.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
};

type CustomizeColumnsProps<TRow> = {
  table: Table<TRow>;
};

/**
 * Column visibility toggles. Lists every hideable column as a checkbox row; the
 * checked state and toggle come straight from the TanStack column API, so the
 * changes flow through the same persisted onColumnVisibilityChange as everything
 * else. Renders nothing when no column can be hidden.
 */
export function CustomizeColumns<TRow>({ table }: CustomizeColumnsProps<TRow>) {
  const columns = table.getAllColumns().filter((column) => column.getCanHide());
  if (columns.length === 0) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" aria-label="Customize columns">
          <SlidersHorizontal />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56">
        <div className="px-2 pb-1.5 text-xs font-medium tracking-wide text-text-3 uppercase">
          Toggle columns
        </div>
        {columns.map((column) => {
          const visible = column.getIsVisible();
          return (
            <button
              key={column.id}
              type="button"
              role="checkbox"
              aria-checked={visible}
              onClick={() => column.toggleVisibility()}
              className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm text-text-2 hover:bg-panel-2"
            >
              <span
                className={cn(
                  "flex size-4 shrink-0 items-center justify-center rounded-[5px] border",
                  visible ? "border-accent bg-accent text-white" : "border-border",
                )}
              >
                {visible && <Check className="size-3" />}
              </span>
              <span className="flex-1 truncate">{columnLabel(column)}</span>
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
