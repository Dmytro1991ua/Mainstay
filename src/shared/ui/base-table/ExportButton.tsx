import { Download } from "lucide-react";

import { Button } from "@/shared/ui/button";

import { downloadCsv, tableToCsv } from "./export";

import type { Table } from "@tanstack/react-table";

type ExportButtonProps<TRow> = {
  table: Table<TRow>;
  fileName: string;
  disabled?: boolean;
};

/**
 * Exports the rows loaded so far to a CSV download. With infinite scroll that's
 * the pages fetched to this point — the count is shown on the button and spelled
 * out in the tooltip so it never reads as a full-dataset export (a complete
 * export would need a dedicated server endpoint).
 */
export function ExportButton<TRow>({ table, fileName, disabled }: ExportButtonProps<TRow>) {
  const count = table.getRowModel().rows.length;
  return (
    <Button
      variant="outline"
      size="sm"
      aria-label="Export loaded rows to CSV"
      title="Exports the rows loaded so far"
      disabled={disabled}
      onClick={() => downloadCsv(fileName, tableToCsv(table))}
    >
      <Download />
      Export{count > 0 ? ` (${count})` : ""}
    </Button>
  );
}
