import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { useAuthStore } from "@/shared/stores/auth-store";

import { getInventoryItem } from "../api/inventory.api";

import { INVENTORY_KEY } from "./use-inventory";
import { useInventoryDelete } from "./use-inventory-delete";
import { useInventoryForm } from "./use-inventory-form";
import { useInventoryRestock } from "./use-inventory-restock";

export const useInventoryDetail = (itemId: string) => {
  const navigate = useNavigate();
  const roles = useAuthStore((s) => s.user?.roles ?? []);
  const canManage = roles.some((r) => r === "ADMIN" || r === "MANAGER");
  const canDelete = roles.some((r) => r === "ADMIN" || r === "MANAGER");

  const {
    data: item,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: [INVENTORY_KEY, itemId],
    queryFn: () => getInventoryItem(itemId),
  });

  const { openEdit, form, isSaving, handleSave, sheetMode, closeSheet } = useInventoryForm();
  const {
    openDelete,
    deleteTarget,
    handleDelete: _handleDelete,
    closeDelete,
    isDeleting,
  } = useInventoryDelete();
  const {
    restockTarget,
    quantityToAdd,
    setQuantityToAdd,
    openRestock,
    closeRestock,
    handleRestock,
    isRestocking,
  } = useInventoryRestock();

  const handleDelete = async () => {
    try {
      await _handleDelete();
      navigate({ to: "/inventory" });
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return {
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
  };
};
