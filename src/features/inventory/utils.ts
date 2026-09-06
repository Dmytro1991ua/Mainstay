import type { RowHighlightInfo, TableUrlState } from "@/shared/ui/data-table";
import { PillStatus } from "@/shared/ui/pill";

import { ROW_HIGHLIGHT } from "./config";

import type { InventoryItem, InventoryCategory, InventoryListParams } from "./api/inventory.api";

// Category codes are enum-shaped (e.g. "SAFETY_EQUIPMENT"); reuse the shared formatter.
export { formatEnumLabel as formatCategoryLabel } from "@/shared/utils";

export const getInventoryStatus = (quantity: number, minStockLevel: number): PillStatus => {
  if (quantity === 0) return PillStatus.OutOfStock;

  if (quantity < minStockLevel) return PillStatus.LowStock;

  return PillStatus.InStock;
};

export const getInventoryRowHighlight = (row: InventoryItem): RowHighlightInfo => {
  const status = getInventoryStatus(row.quantity, row.minStockLevel);
  return { isHighlighted: true, highlightStyles: ROW_HIGHLIGHT[status] ?? "" };
};

export const buildInventoryParams = (
  tableState: TableUrlState,
  search: string | undefined,
): InventoryListParams => {
  const [activeSort] = tableState.sorting ?? [];

  return {
    search: search || undefined,
    status: tableState.filters?.stock?.[0] as InventoryListParams["status"],
    category: tableState.filters?.category?.[0] as InventoryCategory | undefined,
    sortBy: (activeSort?.id as InventoryListParams["sortBy"]) ?? "name",
    sortOrder: activeSort?.desc ? "desc" : "asc",
    limit: 25,
  };
};
