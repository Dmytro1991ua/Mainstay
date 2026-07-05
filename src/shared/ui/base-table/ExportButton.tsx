import { Download } from "lucide-react";

import { Button } from "@/shared/ui/button";

import { downloadCsv, tableToCsv } from "./export";

import type { Table } from "@tanstack/react-table";

type ExportButtonProps<TRow> = {
  table: Table<TRow>;
  fileName: string;
  disabled?: boolean;
};

/** Exports the currently-loaded rows to a CSV download. */
export function ExportButton<TRow>({ table, fileName, disabled }: ExportButtonProps<TRow>) {
  return (
    <Button
      variant="outline"
      size="sm"
      aria-label="Export to CSV"
      disabled={disabled}
      onClick={() => downloadCsv(fileName, tableToCsv(table))}
    >
      <Download />
      Export
    </Button>
  );
}
