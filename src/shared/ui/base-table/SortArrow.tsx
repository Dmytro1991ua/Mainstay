import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";

import { cn } from "@/shared/lib/utils";

type SortArrowProps = {
  /** TanStack's `column.getIsSorted()` value. */
  direction: "asc" | "desc" | false;
};

/**
 * Sort indicator for a sortable header. The neutral (unsorted) glyph is muted
 * and only fully reveals on header hover, so idle headers stay calm.
 */
export function SortArrow({ direction }: SortArrowProps) {
  if (direction === "asc") return <ChevronUp className="h-3.5 w-3.5 text-text-2" />;
  if (direction === "desc") return <ChevronDown className="h-3.5 w-3.5 text-text-2" />;
  return (
    <ChevronsUpDown
      className={cn("h-3.5 w-3.5 text-text-3 opacity-0 transition-opacity group-hover/th:opacity-100")}
    />
  );
}
