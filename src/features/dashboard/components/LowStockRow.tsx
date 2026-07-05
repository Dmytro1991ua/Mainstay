import { cn } from "@/shared/lib/utils";

import { StockBar } from "./StockBar";

import type { InventoryItem } from "../api/dashboard-api";

export const LowStockRow = ({ item }: { item: InventoryItem }) => (
  <div className={cn("flex items-center justify-between gap-3 py-2.5")}>
    <div className={cn("min-w-0 flex-1")}>
      <p className={cn("truncate text-sm font-medium text-text")}>{item.name}</p>
      <p className={cn("text-[12px] text-text-3")}>{item.serialNumber}</p>
    </div>
    <StockBar quantity={item.quantity} minStockLevel={item.minStockLevel} />
  </div>
);
