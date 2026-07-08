import type { ColumnsValueAccessors } from "./types";

// Add column-specific export formatters here keyed by columnDef.id.
// Example: status: (cell) => STATUS_LABELS[cell.getValue<string>()] ?? cell.getValue<string>()
// These apply across all tables — for table-specific overrides use a per-table accessor map.
export const columnsValueAccessors: ColumnsValueAccessors = {};
