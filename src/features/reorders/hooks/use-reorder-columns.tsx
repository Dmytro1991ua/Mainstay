import { format } from "date-fns";

import { cn } from "@/shared/lib/utils";
import { Pill } from "@/shared/ui/pill";
import { formatMoney } from "@/shared/utils";

import { ReorderRowActions } from "../components/ReorderRowActions";
import { REORDER_STATUS_PILL } from "../config";
import { getReorderEstimateDifference } from "../utils";

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
      size: 240,
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
      size: 140,
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
      size: 90,
      cell: ({ row }) => <span className="tabular-nums text-text-2">{row.original.quantity}</span>,
    },
    {
      id: "unitCostAtRaise",
      accessorKey: "unitCostAtRaise",
      header: "Unit cost",
      enableSorting: false,
      size: 95,
      cell: ({ row }) =>
        row.original.unitCostAtRaise == null ? (
          <span className="text-text-3">—</span>
        ) : (
          <span className="tabular-nums text-text-2">
            {formatMoney(row.original.unitCostAtRaise)}
          </span>
        ),
    },
    {
      id: "lineTotal",
      accessorKey: "lineTotal",
      header: "Line total",
      enableSorting: false,
      size: 100,
      cell: ({ row }) =>
        row.original.lineTotal == null ? (
          <span className="text-text-3">—</span>
        ) : (
          <span className="tabular-nums font-medium text-text">
            {formatMoney(row.original.lineTotal)}
          </span>
        ),
    },
    {
      id: "receivedUnitCost",
      accessorKey: "receivedUnitCost",
      header: "Actual cost",
      enableSorting: false,
      size: 100,
      cell: ({ row }) =>
        row.original.receivedUnitCost == null ? (
          <span className="text-text-3">—</span>
        ) : (
          <span className="tabular-nums text-text-2">
            {formatMoney(row.original.receivedUnitCost)}
          </span>
        ),
    },
    {
      id: "receivedTotal",
      accessorKey: "receivedTotal",
      header: "Actual total",
      enableSorting: false,
      size: 105,
      cell: ({ row }) =>
        row.original.receivedTotal == null ? (
          <span className="text-text-3">—</span>
        ) : (
          <span className="tabular-nums font-medium text-text">
            {formatMoney(row.original.receivedTotal)}
          </span>
        ),
    },
    {
      id: "variance",
      accessorKey: "variance",
      header: "Vs estimate",
      enableSorting: false,
      size: 100,
      cell: ({ row }) => {
        if (row.original.variance == null) return <span className="text-text-3">—</span>;

        const { text, className } = getReorderEstimateDifference(row.original.variance);

        return <span className={cn("tabular-nums font-medium", className)}>{text}</span>;
      },
    },
    {
      id: "reorderPoint",
      header: "Reorder point",
      enableSorting: false,
      size: 110,
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
      size: 110,
      cell: ({ row }) => <Pill status={REORDER_STATUS_PILL[row.original.status]} />,
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: "Raised",
      enableSorting: true,
      size: 120,
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
