import type { ActiveFilters } from "./types";
import type { Column } from "@tanstack/react-table";

export const columnLabel = <TData>(col: Column<TData>): string =>
  typeof col.columnDef.header === "string" ? col.columnDef.header : col.id;

export const totalSelectedCount = (activeFilters: ActiveFilters): number =>
  Object.values(activeFilters).reduce((sum, values) => sum + values.length, 0);

export const toggleFilterValue = (
  current: string[],
  value: string,
  type: "single" | "multi",
): string[] => {
  if (type === "single") return current[0] === value ? [] : [value];

  return current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
};
