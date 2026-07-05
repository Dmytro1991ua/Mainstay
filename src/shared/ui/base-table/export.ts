import type { Table } from "@tanstack/react-table";

/** RFC-4180 field escaping: quote when the value holds a comma, quote, or newline. */
const escapeCsv = (value: unknown): string => {
  const s = value == null ? "" : String(value);
  return /["\n\r,]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

/**
 * Serialize the table's CURRENTLY LOADED rows to CSV, using the visible data
 * columns (the select/display columns without an accessor are skipped). With
 * infinite scroll this exports the pages fetched so far — same as the source
 * pattern; a full-dataset export would need a dedicated endpoint.
 */
export function tableToCsv<TRow>(table: Table<TRow>): string {
  const columns = table
    .getVisibleLeafColumns()
    .filter((column) => column.id !== "select" && column.accessorFn);

  const header = columns.map((column) =>
    escapeCsv(typeof column.columnDef.header === "string" ? column.columnDef.header : column.id),
  );
  const rows = table
    .getRowModel()
    .rows.map((row) => columns.map((column) => escapeCsv(row.getValue(column.id))).join(","));

  return [header.join(","), ...rows].join("\r\n");
}

/** Trigger a client-side download of `csv` as a UTF-8 CSV file (BOM for Excel). */
export function downloadCsv(fileName: string, csv: string): void {
  const blob = new Blob(["﻿", csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName.endsWith(".csv") ? fileName : `${fileName}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}
