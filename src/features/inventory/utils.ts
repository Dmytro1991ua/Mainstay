import { PillStatus } from "@/shared/ui/pill";

export const getInventoryStatus = (quantity: number, minStockLevel: number): PillStatus => {
  if (quantity === 0) return PillStatus.OutOfStock;

  if (quantity < minStockLevel) return PillStatus.LowStock;

  return PillStatus.InStock;
};
