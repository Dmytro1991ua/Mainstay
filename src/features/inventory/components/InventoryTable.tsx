import { AlertTriangle, Package, Plus, RotateCcw } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { DataTable } from "@/shared/ui/data-table";
import type { OnSetTableState, RowHighlightInfo, TableUrlState } from "@/shared/ui/data-table";
import { EmptyState } from "@/shared/ui/empty-state";
import { PillStatus } from "@/shared/ui/pill";

import { useInventoryColumns } from "../hooks/use-inventory-columns";
import { useInventoryData } from "../hooks/use-inventory-data";
import { useInventoryDelete } from "../hooks/use-inventory-delete";
import { useInventoryForm } from "../hooks/use-inventory-form";
import { getInventoryStatus } from "../utils";

import { InventoryDeleteDialog } from "./InventoryDeleteDialog";
import { InventoryFormSheet } from "./InventoryFormSheet";

import type { InventoryItem } from "../api/inventory.api";

const ROW_HIGHLIGHT: Partial<Record<PillStatus, string>> = {
  [PillStatus.InStock]: "bg-row-green",
  [PillStatus.LowStock]: "bg-row-amber",
  [PillStatus.OutOfStock]: "bg-row-red",
};

const getInventoryRowHighlight = (row: InventoryItem): RowHighlightInfo => {
  const status = getInventoryStatus(row.quantity, row.minStockLevel);
  return { isHighlighted: true, highlightStyles: ROW_HIGHLIGHT[status] ?? "" };
};

type InventoryTableProps = {
  tableState: TableUrlState;
  onSetTableState: OnSetTableState;
};

export const InventoryTable = ({ tableState, onSetTableState }: InventoryTableProps) => {
  const {
    items,
    isLoading,
    isError,
    refetch,
    canManage,
    canDelete,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    filterConfig,
  } = useInventoryData(tableState);
  const { openEdit, openAdd, form, isSaving, handleSave, sheetMode, closeSheet } =
    useInventoryForm();
  const { isDeleting, openDelete, deleteTarget, handleDelete, closeDelete } = useInventoryDelete();
  const columns = useInventoryColumns({
    canManage,
    canDelete,
    onEdit: openEdit,
    onDelete: openDelete,
  });

  return (
    <>
      <DataTable
        tableId="inventory"
        columns={columns}
        data={items}
        isPending={isLoading}
        isError={isError}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
        searchPlaceholder="Search name or serial…"
        filterConfig={filterConfig}
        enableRowSelection
        getRowHighlightInfo={getInventoryRowHighlight}
        actions={
          canManage ? (
            <Button onClick={openAdd}>
              <Plus />
              Add item
            </Button>
          ) : null
        }
        emptyState={
          <EmptyState
            icon={Package}
            message="No items found"
            description="Try adjusting your search or filters."
          />
        }
        errorState={
          <EmptyState
            icon={AlertTriangle}
            message="Couldn't load inventory"
            description="The server didn't respond."
            variant="red"
            action={
              <Button onClick={() => refetch()}>
                <RotateCcw className="size-3.5" />
                Retry
              </Button>
            }
          />
        }
        onRowClick={canManage ? openEdit : undefined}
        getRowId={(row) => row.id}
        tableState={tableState}
        onSetTableState={onSetTableState}
        exportFilename="inventory"
      />
      <InventoryFormSheet
        sheetMode={sheetMode}
        form={form}
        onSave={handleSave}
        onClose={closeSheet}
        isSaving={isSaving}
      />
      <InventoryDeleteDialog
        target={deleteTarget}
        onConfirm={handleDelete}
        onClose={closeDelete}
        isDeleting={isDeleting}
      />
    </>
  );
};
