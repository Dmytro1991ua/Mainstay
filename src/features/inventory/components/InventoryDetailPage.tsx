import { AlertTriangle, RotateCcw } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { DetailShell } from "@/shared/ui/detail-shell";
import { EmptyState } from "@/shared/ui/empty-state";
import { PillStatus } from "@/shared/ui/pill";

import { useInventoryDetail } from "../hooks/use-inventory-detail";
import { getInventoryDetailFields } from "../inventory-detail.config";
import { getInventoryStatus } from "../utils";

import { InventoryDeleteDialog } from "./InventoryDeleteDialog";
import { InventoryDetailActions } from "./InventoryDetailActions";
import { InventoryFormSheet } from "./InventoryFormSheet";
import { RestockDialog } from "./RestockDialog";

const SKELETON_KEYS = [
  "Stock level",
  "Serial number",
  "Category",
  "Quantity",
  "Added",
  "Last updated",
];

type InventoryDetailPageProps = { itemId: string };

export const InventoryDetailPage = ({ itemId }: InventoryDetailPageProps) => {
  const {
    item,
    isPending,
    isError,
    refetch,
    canManage,
    canDelete,
    openEdit,
    form,
    isSaving,
    handleSave,
    sheetMode,
    closeSheet,
    openDelete,
    deleteTarget,
    handleDelete,
    closeDelete,
    isDeleting,
    restockTarget,
    quantityToAdd,
    setQuantityToAdd,
    openRestock,
    closeRestock,
    handleRestock,
    isRestocking,
  } = useInventoryDetail(itemId);

  if (isPending) {
    return (
      <DetailShell
        backTo="/inventory"
        title=""
        fields={[]}
        isPending
        skeletonKeys={SKELETON_KEYS}
      />
    );
  }

  if (isError || !item) {
    return (
      <div className="flex flex-1 flex-col gap-4 min-h-0">
        <DetailShell backTo="/inventory" title="Item not found" fields={[]} />
        <div className="flex flex-1 items-center justify-center rounded-xl border border-border bg-panel p-6 shadow-card">
          <EmptyState
            icon={AlertTriangle}
            message="Item not found"
            description="This item may have been deleted or doesn't exist."
            variant="red"
            action={
              <Button onClick={() => refetch()}>
                <RotateCcw className="size-3.5" />
                Retry
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <DetailShell
        backTo="/inventory"
        title={item.name}
        actions={
          <InventoryDetailActions
            canManage={canManage}
            canDelete={canDelete}
            needsRestock={
              getInventoryStatus(item.quantity, item.minStockLevel) !== PillStatus.InStock
            }
            onEdit={() => openEdit(item)}
            onRestock={() => openRestock(item)}
            onDelete={() => openDelete(item)}
          />
        }
        fields={getInventoryDetailFields(item)}
        skeletonKeys={SKELETON_KEYS}
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
