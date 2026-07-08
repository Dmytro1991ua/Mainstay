import { type Table } from "@tanstack/react-table";
import { SlidersHorizontal } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

import { columnLabel } from "./utils";

export const ColumnVisibilityMenu = <TData,>({ table }: { table: Table<TData> }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5 border-accent bg-accent text-white hover:bg-accent/90 hover:text-white aria-expanded:bg-accent aria-expanded:text-white"
      >
        <SlidersHorizontal className="size-3" />
        Columns
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-44">
      <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
      <DropdownMenuSeparator />
      {table
        .getAllColumns()
        .filter((col) => col.getCanHide())
        .map((col) => (
          <DropdownMenuItem
            key={col.id}
            className="gap-2"
            onSelect={(e) => {
              e.preventDefault();
              col.toggleVisibility();
            }}
          >
            <Checkbox
              checked={col.getIsVisible()}
              onCheckedChange={() => col.toggleVisibility()}
              aria-label={`Toggle ${columnLabel(col)}`}
            />
            <span className={cn(!col.getIsVisible() && "text-text-3")}>{columnLabel(col)}</span>
          </DropdownMenuItem>
        ))}
    </DropdownMenuContent>
  </DropdownMenu>
);
