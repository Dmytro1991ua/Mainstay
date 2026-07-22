import { Package } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { EmptyState } from "@/shared/ui/empty-state";

import { LowStockRow } from "./LowStockRow";

import type { InventoryItem } from "../api/dashboard-api";

export const LowStockList = ({ items }: { items: InventoryItem[] }) => {
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
    </div>
  );
};
