import { cn } from "@/shared/lib/utils";

import { calculateStockStatus } from "../utils";

type StockBarProps = {
  quantity: number;
  minStockLevel: number;
};

export const StockBar = ({ quantity, minStockLevel }: StockBarProps) => {
  const { fillPercent, isLowStock } = calculateStockStatus(quantity, minStockLevel);

  return (
    <div className={cn("flex items-center gap-2")}>
      <div className={cn("h-1.5 w-14 overflow-hidden rounded-full bg-panel-2")}>
        <div
          className={cn("h-full rounded-full", isLowStock ? "bg-amber" : "bg-green")}
          style={{ width: `${fillPercent}%` }}
        />
      </div>
      <span
        className={cn(
          "w-12 text-right text-[12px] tabular-nums",
          isLowStock ? "text-amber" : "text-text-3",
        )}
      >
        {quantity} / {minStockLevel}
      </span>
    </div>
  );
};
