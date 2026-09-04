import { Checkbox } from "@/shared/ui/checkbox";
import { DataTableCheckbox } from "@/shared/ui/data-table/data-table-checkbox";
import { Pill } from "@/shared/ui/pill";
import { RowActions } from "@/shared/ui/row-actions";

import { ASSET_STATUS_PILL } from "../config";
import { formatCategoryLabel } from "../utils";

import type { Asset } from "../api/assets.api";
import type { ColumnDef } from "@tanstack/react-table";

type UseAssetColumnsOptions = {
  canManage: boolean;
  canDelete: boolean;
  onEdit: (asset: Asset) => void;
  onDelete: (asset: Asset) => void;
};

export const useAssetColumns = ({
  canManage,
  canDelete,
  onEdit,
  onDelete,
}: UseAssetColumnsOptions): ColumnDef<Asset>[] => {
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
      size: 260,
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      id: "serialNumber",
      accessorKey: "serialNumber",
      header: "Serial Number",
      enableSorting: false,
      size: 160,
      cell: ({ row }) => (
        <span className="font-mono text-xs text-text-2">{row.original.serialNumber}</span>
      ),
    },
    {
      id: "category",
      accessorKey: "category",
      header: "Category",
      enableSorting: true,
      size: 150,
      cell: ({ row }) => (
        <span className="text-text-2">{formatCategoryLabel(row.original.category)}</span>
      ),
    },
    {
      id: "location",
      accessorKey: "location",
      header: "Location",
      enableSorting: true,
      size: 180,
      cell: ({ row }) => <span className="text-text-2">{row.original.location}</span>,
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      enableSorting: true,
      size: 130,
      cell: ({ row }) => <Pill status={ASSET_STATUS_PILL[row.original.status]} />,
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
              const asset = row.original;

              return (
                <RowActions
                  label={asset.name}
                  onEdit={canManage ? () => onEdit(asset) : undefined}
                  onDelete={canDelete ? () => onDelete(asset) : undefined}
                />
              );
            },
          },
        ] satisfies ColumnDef<Asset>[])
      : []),
  ];
};
