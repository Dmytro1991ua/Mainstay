import { Checkbox } from "@/shared/ui/checkbox";
import { DataTableCheckbox } from "@/shared/ui/data-table/data-table-checkbox";
import { Pill, PillStatus } from "@/shared/ui/pill";
import { RowActions } from "@/shared/ui/row-actions";

import { formatCategoryLabel, getInventoryStatus } from "../utils";

import type { InventoryItem } from "../api/inventory.api";
import type { ColumnDef } from "@tanstack/react-table";

type UseInventoryColumnsOptions = {
  canManage: boolean;
  canDelete: boolean;
  onEdit: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
  onRestock: (item: InventoryItem) => void;
};

export const useInventoryColumns = ({
  canManage,
  canDelete,
  onEdit,
  onDelete,
  onRestock,
}: UseInventoryColumnsOptions): ColumnDef<InventoryItem>[] => {
  return [
    {
      id: "select",
      header: ({ table }) => <DataTableCheckbox table={table} />,
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onClick={(e) => {
            e.stopPropagation();
            row.toggleSelected(!row.getIsSelected());
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableResizing: false,
      size: 40,
    },
    {
      id: "name",
      accessorKey: "name",
      header: "Name",
      enableSorting: true,
      size: 300,
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      id: "serialNumber",
      accessorKey: "serialNumber",
      header: "Serial Number",
      enableSorting: false,
      size: 180,
      cell: ({ row }) => (
        <span className="font-mono text-xs text-text-2">{row.original.serialNumber}</span>
      ),
    },
    {
      id: "category",
      accessorKey: "category",
      header: "Category",
      enableSorting: true,
      size: 160,
      cell: ({ row }) => (
        <span className="text-text-2">{formatCategoryLabel(row.original.category)}</span>
      ),
    },
    {
      id: "quantity",
      accessorKey: "quantity",
      header: "Quantity",
      enableSorting: true,
      size: 80,
      cell: ({ row }) => row.original.quantity,
    },
    {
      id: "minStockLevel",
      accessorKey: "minStockLevel",
      header: "Min Stock",
      enableSorting: false,
      size: 80,
      cell: ({ row }) => <span className="text-text-2">{row.original.minStockLevel}</span>,
    },
    {
      id: "status",
      header: "Status",
      enableSorting: false,
      size: 120,
      cell: ({ row }) => (
        <Pill status={getInventoryStatus(row.original.quantity, row.original.minStockLevel)} />
      ),
    },
    ...(canManage || canDelete
      ? ([
          {
            id: "actions",
            header: "",
            enableSorting: false,
            enableResizing: false,
            enableHiding: false,
            size: canManage && canDelete ? 112 : 48,
            cell: ({ row }) => {
              const item = row.original;
              const status = getInventoryStatus(item.quantity, item.minStockLevel);
              const needsRestock =
                status === PillStatus.LowStock || status === PillStatus.OutOfStock;

              return (
                <RowActions
                  label={item.name}
                  onEdit={canManage ? () => onEdit(item) : undefined}
                  onRestock={canManage && needsRestock ? () => onRestock(item) : undefined}
                  onDelete={canDelete ? () => onDelete(item) : undefined}
                />
              );
            },
          },
        ] satisfies ColumnDef<InventoryItem>[])
      : []),
  ];
};
