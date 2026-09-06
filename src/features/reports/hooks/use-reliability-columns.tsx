import type { AssetStatus } from "@/features/assets/api/assets.api";
import { ASSET_STATUS_PILL } from "@/features/assets/config";
import { Pill } from "@/shared/ui/pill";
import { formatEnumLabel } from "@/shared/utils";

import { formatDays } from "../utils";

import type { AssetReliabilityRow } from "../api/reports.api";
import type { ColumnDef } from "@tanstack/react-table";

const METRIC_COLUMNS: { id: keyof AssetReliabilityRow; header: string }[] = [
  { id: "totalTasks", header: "Total" },
  { id: "openTasks", header: "Open" },
  { id: "overdueTasks", header: "Overdue" },
  { id: "completedTasks", header: "Completed" },
  { id: "partsConsumed", header: "Parts" },
];

export const useReliabilityColumns = (): ColumnDef<AssetReliabilityRow>[] => {
  return [
    {
      id: "name",
      accessorKey: "name",
      header: "Asset",
      enableSorting: true,
      size: 260,
      cell: ({ row }) => (
        <div>
          <span className="font-medium">{row.original.name}</span>
          <div className="font-mono text-xs text-text-3">{row.original.serialNumber}</div>
        </div>
      ),
    },
    {
      id: "category",
      accessorKey: "category",
      header: "Category",
      enableSorting: false,
      size: 150,
      cell: ({ row }) => (
        <span className="text-text-2">{formatEnumLabel(row.original.category)}</span>
      ),
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      enableSorting: false,
      size: 130,
      cell: ({ row }) => <Pill status={ASSET_STATUS_PILL[row.original.status as AssetStatus]} />,
    },
    ...METRIC_COLUMNS.map<ColumnDef<AssetReliabilityRow>>(({ id, header }) => ({
      id,
      accessorKey: id,
      header,
      enableSorting: true,
      size: 110,
      cell: ({ row }) => <span className="tabular-nums text-text-2">{row.original[id]}</span>,
    })),
    {
      id: "avgCompletionDays",
      accessorKey: "avgCompletionDays",
      header: "Avg days",
      enableSorting: true,
      size: 110,
      cell: ({ row }) => (
        <span className="tabular-nums text-text-2">
          {formatDays(row.original.avgCompletionDays)}
        </span>
      ),
    },
  ];
};
