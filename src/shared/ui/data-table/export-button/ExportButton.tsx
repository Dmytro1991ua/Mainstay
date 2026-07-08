import { Download } from "lucide-react";
import { CSVLink } from "react-csv";

import { Button } from "@/shared/ui/button";

import { buildCSVString, buildExportFilename, getDataToExport } from "./utils";

import type { Table } from "@tanstack/react-table";

type ExportButtonProps<T> = {
  table: Table<T>;
  filename: string;
};

export const ExportButton = <T,>({ table, filename }: ExportButtonProps<T>) => {
  const isDisabled = table.getCoreRowModel().rows.length === 0;
  const csvString = buildCSVString(
    getDataToExport(table.getVisibleLeafColumns(), table.getCoreRowModel()),
  );
  const exportFilename = buildExportFilename(filename, new Date());

  if (isDisabled) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5 border-accent bg-accent/40 text-white"
        disabled
      >
        <Download className="size-3.5" />
        Export
      </Button>
    );
  }

  return (
    <CSVLink
      className="inline-flex h-7 items-center gap-1 rounded-[min(var(--radius-md),12px)] border border-accent bg-accent px-2.5 text-[0.8rem] font-medium text-white hover:bg-accent/90"
      data={csvString}
      headers={["sep=,"]}
      filename={`${exportFilename}.csv`}
      uFEFF
    >
      <Download className="size-3.5" />
      Export
    </CSVLink>
  );
};
