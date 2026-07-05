import type { FilterConfig } from "@/shared/ui/base-table";

/**
 * Inventory filter panel. The backend only filters the list by `lowStock`, so
 * that's the one dimension — a single checkbox. Adding a server-supported filter
 * later is just another entry here plus the mapping in InventoryTable.
 */
export const inventoryFilterConfig: FilterConfig[] = [
  {
    key: "lowStock",
    label: "Stock",
    type: "checkbox",
    options: [{ label: "Low stock only", value: "true" }],
  },
];
