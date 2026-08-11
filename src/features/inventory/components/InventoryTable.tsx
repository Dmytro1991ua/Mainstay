import { useNavigate } from "@tanstack/react-router";
import { AlertTriangle, Package, Plus, RotateCcw } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { DataTable } from "@/shared/ui/data-table";
import type { OnSetTableState, TableUrlState } from "@/shared/ui/data-table";
import { EmptyState } from "@/shared/ui/empty-state";

import { useInventoryColumns } from "../hooks/use-inventory-columns";
import { useInventoryData } from "../hooks/use-inventory-data";
import { useInventoryDelete } from "../hooks/use-inventory-delete";
import { useInventoryForm } from "../hooks/use-inventory-form";
import { useInventoryRestock } from "../hooks/use-inventory-restock";
import { getInventoryRowHighlight } from "../utils";

import { InventoryDeleteDialog } from "./InventoryDeleteDialog";
import { InventoryFormSheet } from "./InventoryFormSheet";
import { RestockDialog } from "./RestockDialog";

import type { InventoryItem } from "../api/inventory.api";

type InventoryTableProps = {
  tableState: TableUrlState;
  onSetTableState: OnSetTableState;
};

export const InventoryTable = ({ tableState, onSetTableState }: InventoryTableProps) => {
  const navigate = useNavigate();

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
  const {
    restockTarget,
    quantityToAdd,
    setQuantityToAdd,
    openRestock,
    closeRestock,
    handleRestock,
    isRestocking,
  } = useInventoryRestock();
  const columns = useInventoryColumns({
    canManage,
    canDelete,
    onEdit: openEdit,
    onDelete: openDelete,
    onRestock: openRestock,
  });

  const handleRowClick = (item: InventoryItem) => {
    navigate({ to: "/inventory/$itemId", params: { itemId: item.id } });
  };

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
            <Button onClick={openAdd} disabled={isError}>
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
        onRowClick={handleRowClick}
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
      <RestockDialog
        target={restockTarget}
        quantityToAdd={quantityToAdd}
        onQuantityChange={setQuantityToAdd}
        onConfirm={handleRestock}
        onClose={closeRestock}
        isRestocking={isRestocking}
      />
    </>
  );
};
