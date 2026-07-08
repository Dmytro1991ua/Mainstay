export const HEADER_COLUMNS_TO_IGNORE = new Set(["select", "actions"]);
export const ROW_CELLS_TO_IGNORE = new Set([...HEADER_COLUMNS_TO_IGNORE, "select"]);
