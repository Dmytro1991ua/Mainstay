import { format } from "date-fns";

import { Pill } from "@/shared/ui/pill";

import { ReorderRowActions } from "../components/ReorderRowActions";
import { REORDER_STATUS_PILL } from "../config";

import type { Reorder } from "../api/reorders.api";
import type { ReorderActionType } from "../types";
import type { ColumnDef } from "@tanstack/react-table";

type UseReorderColumnsOptions = {
  onAction: (type: ReorderActionType, reorder: Reorder) => void;
};

export const useReorderColumns = ({ onAction }: UseReorderColumnsOptions): ColumnDef<Reorder>[] => {
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
      id: "supplier",
      header: "Supplier",
      enableSorting: false,
      size: 170,
      cell: ({ row }) =>
        row.original.inventoryItem.supplier ? (
          <span className="text-text-2">{row.original.inventoryItem.supplier}</span>
        ) : (
          <span className="text-text-3">—</span>
        ),
    },
    {
      id: "quantity",
      accessorKey: "quantity",
      header: "Quantity",
      enableSorting: false,
      size: 100,
      cell: ({ row }) => <span className="tabular-nums text-text-2">{row.original.quantity}</span>,
    },
    {
      id: "reorderPoint",
      header: "Reorder point",
      enableSorting: false,
      size: 120,
      cell: ({ row }) =>
        row.original.inventoryItem.reorderPoint == null ? (
          <span className="text-text-3">—</span>
        ) : (
          <span className="tabular-nums text-text-2">
            {row.original.inventoryItem.reorderPoint}
          </span>
        ),
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
    {
      id: "actions",
      header: "",
      enableSorting: false,
      enableResizing: false,
      enableHiding: false,
      size: 220,
      cell: ({ row }) => <ReorderRowActions reorder={row.original} onAction={onAction} />,
    },
  ];
};
