import { Package } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { EmptyState } from "@/shared/ui/empty-state";

import { LowStockRow } from "./LowStockRow";

import type { InventoryItem } from "../api/dashboard-api";

type LowStockListProps = {
  items: InventoryItem[];
  total: number;
};

export const LowStockList = ({ items, total }: LowStockListProps) => {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={Package}
        message="All stocked up."
        description="No items are below minimum stock level."
        variant="green"
      />
    );
  }

  return (
    <div>
      <div className={cn("divide-y divide-border")}>
        {items.map((item) => (
          <LowStockRow key={item.id} item={item} />
        ))}
      </div>
      {total > items.length && (
        <p className={cn("mt-3 text-center text-[12px] text-text-3")}>
          +{total - items.length} more items below minimum stock
        </p>
      )}
    </div>
  );
};
