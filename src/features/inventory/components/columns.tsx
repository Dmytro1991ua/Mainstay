import { format } from "date-fns";
import { TriangleAlert } from "lucide-react";

import { cn } from "@/shared/lib/utils";

import type { InventoryItem } from "../api/inventory-api";
import type { ColumnDef } from "@tanstack/react-table";

const isLowStock = (item: InventoryItem) => item.quantity <= item.minStockLevel;

/**
 * Column model for the inventory table. `accessorKey` for sortable columns
 * matches the server's `sortBy` enum (name / quantity / createdAt); the others
 * disable sorting since the API can't order by them.
 */
export const inventoryColumns: ColumnDef<InventoryItem>[] = [
  {
    accessorKey: "name",
    header: "Name",
    size: 260,
    cell: ({ getValue }) => <span className="font-medium text-text">{getValue<string>()}</span>,
  },
  {
    accessorKey: "serialNumber",
    header: "Serial number",
    enableSorting: false,
    size: 190,
    cell: ({ getValue }) => (
      <span className="font-mono text-xs text-text-3">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    size: 150,
    cell: ({ row }) => {
      const low = isLowStock(row.original);
      return (
        <span className={cn("inline-flex items-center gap-1.5", low && "text-destructive")}>
          {low && <TriangleAlert className="h-3.5 w-3.5" />}
          {row.original.quantity}
        </span>
      );
    },
  },
  {
    accessorKey: "minStockLevel",
    header: "Min stock",
    enableSorting: false,
    size: 130,
  },
  {
    accessorKey: "createdAt",
    header: "Added",
    size: 150,
    cell: ({ getValue }) => (
      <span className="text-text-3">{format(new Date(getValue<string>()), "MMM d, yyyy")}</span>
    ),
  },
];
