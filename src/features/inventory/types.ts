import type { InventorySortField, SortOrder } from "./api/inventory-api";

/** Shape of the inventory route's URL search params (the table's state home). */
export type InventorySearch = {
  sortBy?: InventorySortField;
  sortOrder?: SortOrder;
  search?: string;
  lowStock?: boolean;
};

const SORT_FIELDS: InventorySortField[] = ["name", "quantity", "createdAt"];

/**
 * Coerce raw URL search into a validated InventorySearch. Unknown/invalid values
 * are dropped (not thrown) so a hand-edited URL degrades gracefully to defaults.
 */
export function validateInventorySearch(raw: Record<string, unknown>): InventorySearch {
  const sortBy = SORT_FIELDS.includes(raw.sortBy as InventorySortField)
    ? (raw.sortBy as InventorySortField)
    : undefined;
  const sortOrder = raw.sortOrder === "asc" || raw.sortOrder === "desc" ? raw.sortOrder : undefined;

  return {
    // sortOrder is meaningless without a field — keep them consistent.
    sortBy,
    sortOrder: sortBy ? (sortOrder ?? "asc") : undefined,
    search: typeof raw.search === "string" && raw.search ? raw.search : undefined,
    lowStock: raw.lowStock === true || raw.lowStock === "true" ? true : undefined,
  };
}
