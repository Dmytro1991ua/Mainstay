import { format } from "date-fns";

import { columnsValueAccessors } from "./config";
import { HEADER_COLUMNS_TO_IGNORE, ROW_CELLS_TO_IGNORE } from "./constants";

import type { Cell, Column, RowModel } from "@tanstack/react-table";

export const convertCurrentDateToExportFilenameDate = (date: Date): string =>
  format(date, "MMddyy'_'HHmma");

export const buildExportFilename = (baseName: string, date: Date): string =>
  `${baseName}_${convertCurrentDateToExportFilenameDate(date)}`;

export const getHeaderColumns = <T>(columns: Column<T, unknown>[]): string[] =>
  columns.reduce<string[]>((acc, column) => {
    if (
      !column.getIsVisible() ||
      typeof column.columnDef.header !== "string" ||
      HEADER_COLUMNS_TO_IGNORE.has(column.id)
    ) {
      return acc;
    }

    return [...acc, column.columnDef.header];
  }, []);

export const formatToCSVValue = (value?: unknown): string => {
  if (value) {
    // Per CSV spec RFC-4180: double quotes inside a quoted field must be escaped by doubling them
    return value.toString().replaceAll('"', '""');
  }
  return "";
};

export const boolToString = (value: boolean | null | undefined): string => (value ? "Yes" : "No");

export const buildCSVString = (data: string[][]): string =>
  data.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");

const getAccessorValue = <T>(cell: Cell<T, unknown>): string => {
  const accessor = columnsValueAccessors[cell.column.id];

  return accessor ? accessor(cell as Cell<unknown, unknown>) : formatToCSVValue(cell.getValue());
};

const getRowsValues = <T>(rowModel: RowModel<T>): string[][] =>
  rowModel.rows.map((row) =>
    row.getVisibleCells().reduce<string[]>((acc, cell) => {
      if (!ROW_CELLS_TO_IGNORE.has(cell.column.id)) {
        acc.push(getAccessorValue(cell));
      }

      return acc;
    }, []),
  );

export const getDataToExport = <T>(
  columns: Column<T, unknown>[],
  rowModel?: RowModel<T>,
): string[][] => {
  if (!rowModel || !columns.length) return [];

  return [getHeaderColumns(columns), ...getRowsValues(rowModel)];
};
