import { cn } from "@/shared/lib/utils";
import { Skeleton } from "@/shared/ui/skeleton";

type DataTableFetchRowsProps = {
  colCount: number;
  rowCount?: number;
  border?: "top" | "bottom";
};

export const DataTableFetchRows = ({
  colCount,
  rowCount = 1,
  border = "bottom",
}: DataTableFetchRowsProps) => (
  <div className="flex flex-col">
    {Array.from({ length: rowCount }, (_, i) => `fetch-row-${i}`).map((key) => (
      <div
        key={key}
        className={cn(
          "flex gap-3 px-3 py-3 border-border",
          border === "top" ? "border-t" : "border-b",
        )}
      >
        {Array.from({ length: colCount }, (_, j) => `${key}-cell-${j}`).map((cellKey) => (
          <Skeleton key={cellKey} className="h-4 flex-1 rounded" />
        ))}
      </div>
    ))}
  </div>
);
