import { useState } from "react";

import { toast } from "@/shared/ui/toast";

import { useDeleteInventory } from "./use-inventory";

import type { InventoryItem } from "../api/inventory.api";

export const useInventoryDelete = () => {
  const deleteMutation = useDeleteInventory();

  const [deleteTarget, setDeleteTarget] = useState<InventoryItem | null>(null);

  const openDelete = (item: InventoryItem) => setDeleteTarget(item);

  const closeDelete = () => setDeleteTarget(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    const { name, id } = deleteTarget;

    await deleteMutation.mutateAsync(id, {
      onSuccess: () => {
        toast.success("Item deleted", {
          description: `"${name}" was removed from inventory.`,
        });
        closeDelete();
      },
      onError: () => {
        toast.error("Failed to delete item");
        closeDelete();
      },
    });
  };

  return {
    deleteTarget,
    openDelete,
    closeDelete,
    handleDelete,
    isDeleting: deleteMutation.isPending,
  };
};
