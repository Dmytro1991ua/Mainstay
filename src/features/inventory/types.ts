import type { InventoryItem } from "./api/inventory.api";

export type SheetMode = { type: "add" } | { type: "edit"; item: InventoryItem };
