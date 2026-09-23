import { format } from "date-fns";

import { Pill } from "@/shared/ui/pill";

import { REORDER_STATUS_PILL } from "../config";

import type { Reorder } from "../api/reorders.api";
import type { ColumnDef } from "@tanstack/react-table";

export const useReorderColumns = (): ColumnDef<Reorder>[] => {
  return [
    {
      id: "item",
      header: "Item",
      enableSorting: false,
      size: 280,
      cell: ({ row }) => (
        <div>
          <span className="font-medium">{row.original.inventoryItem.name}</span>
          <div className="font-mono text-xs text-text-3">
            {row.original.inventoryItem.serialNumber}
          </div>
        </div>
      ),
    },
    {
      id: "quantity",
      accessorKey: "quantity",
      header: "Quantity",
      enableSorting: false,
      size: 110,
      cell: ({ row }) => <span className="tabular-nums text-text-2">{row.original.quantity}</span>,
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      enableSorting: true,
      size: 130,
      cell: ({ row }) => <Pill status={REORDER_STATUS_PILL[row.original.status]} />,
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: "Raised",
      enableSorting: true,
      size: 140,
      cell: ({ row }) => (
        <span className="text-text-2">
          {format(new Date(row.original.createdAt), "MMM d, yyyy")}
        </span>
      ),
    },
  ];
};
