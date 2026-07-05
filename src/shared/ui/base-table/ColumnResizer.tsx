import { cn } from "@/shared/lib/utils";

import type { Header } from "@tanstack/react-table";

type ColumnResizerProps<TRow> = {
  header: Header<TRow, unknown>;
};

/**
 * Draggable grip on the right edge of a resizable header cell. It's a plain div
 * wired to TanStack's resize handler (mouse + touch); the resulting width is
 * applied to the column via `column.getSize()` in the header/body. Clicking it
 * stops propagation so a resize drag never triggers a sort.
 */
export function ColumnResizer<TRow>({ header }: ColumnResizerProps<TRow>) {
  if (!header.column.getCanResize()) return null;

  return (
    <div
      aria-hidden
      onMouseDown={header.getResizeHandler()}
      onTouchStart={header.getResizeHandler()}
      onClick={(e) => e.stopPropagation()}
      className={cn(
        "absolute top-0 right-0 h-full w-1.5 cursor-col-resize touch-none select-none",
        "after:absolute after:top-2 after:bottom-2 after:right-0.5 after:w-px after:bg-border",
        "hover:after:bg-accent hover:after:w-0.5",
        header.column.getIsResizing() && "after:bg-accent after:w-0.5",
      )}
    />
  );
}
