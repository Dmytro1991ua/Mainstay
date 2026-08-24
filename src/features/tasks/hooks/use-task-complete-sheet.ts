import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";

import { fetchInventory } from "@/features/inventory/api/inventory.api";
import type { InventoryItem } from "@/features/inventory/api/inventory.api";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { toast } from "@/shared/ui/toast";

import { useChecklistTemplate } from "./use-checklist-template";
import { usePhotoUpload } from "./use-photo-upload";
import { useCompleteTask, useUploadAfterPhoto } from "./use-tasks";

import type { Task, TaskCategory } from "../api/tasks.api";

export type PartEntry = {
  inventoryItemId: string;
  name: string;
  quantityUsed: number;
  isLowStock: boolean;
};

export const getStockLevel = (item: InventoryItem) => ({
  isOutOfStock: item.quantity === 0,
  isLowStock: item.quantity > 0 && item.quantity <= item.minStockLevel,
});

export const useTaskCompleteSheet = (task: Task, onClose: () => void) => {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [parts, setParts] = useState<PartEntry[]>([]);
  const [pickerItemId, setPickerItemId] = useState("");
  const [pickerQty, setPickerQty] = useState(1);

  const { data: template, isLoading: isTemplateLoading } = useChecklistTemplate(
    task.category as TaskCategory | null,
  );

  const { data: inventoryData } = useInfiniteQuery({
    queryKey: ["inventory-picker"],
    queryFn: ({ pageParam }) =>
      fetchInventory({ page: pageParam as number, limit: 50, sortBy: "name", sortOrder: "asc" }),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.meta.page < last.meta.pages ? last.meta.page + 1 : undefined),
  });

  const inventoryItems = inventoryData?.pages.flatMap((p) => p.data) ?? [];

  const uploadAfterPhotoMutation = useUploadAfterPhoto();
  const completeTaskMutation = useCompleteTask();

  const {
    photoUrl: afterPhotoUrl,
    isUploading: isUploadingPhoto,
    handleUpload: handlePhotoUpload,
  } = usePhotoUpload((file, _onProgress) =>
    uploadAfterPhotoMutation
      .mutateAsync({ id: task.id, file })
      .then((t) => t.afterPhotoUrl ?? null),
  );

  const checklistItems = template?.items ?? [];
  const allChecked = checklistItems.every((i) => checkedItems.has(i));
  const canComplete = !!afterPhotoUrl && allChecked && !isUploadingPhoto;

  const selectableItems = inventoryItems.filter((i) => {
    const { isOutOfStock } = getStockLevel(i);

    return !isOutOfStock && !parts.some((p) => p.inventoryItemId === i.id);
  });

  const toggleItem = (item: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);

      if (next.has(item)) next.delete(item);
      else next.add(item);

      return next;
    });
  };

  const handleAddPart = () => {
    const selected = inventoryItems.find((i) => i.id === pickerItemId);

    if (!selected || pickerQty < 1) return;

    const { isLowStock } = getStockLevel(selected);

    setParts((prev) => [
      ...prev,
      { inventoryItemId: selected.id, name: selected.name, quantityUsed: pickerQty, isLowStock },
    ]);
    setPickerItemId("");
    setPickerQty(1);
  };

  const removePart = (idx: number) => {
    setParts((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleComplete = async () => {
    if (!canComplete) return;

    try {
      await completeTaskMutation.mutateAsync({
        id: task.id,
        data: {
          checklist: Array.from(checkedItems),
          partsUsed: parts.map(({ inventoryItemId, quantityUsed }) => ({
            inventoryItemId,
            quantity: quantityUsed,
          })),
        },
      });
      toast.success("Task completed", {
        description: `"${task.title}" has been marked as completed.`,
      });
      onClose();
    } catch (error) {
      toast.error("Failed to complete task", { description: getApiErrorMessage(error) });
    }
  };

  return {
    afterPhotoUrl,
    isUploadingPhoto,
    checkedItems,
    parts,
    pickerItemId,
    setPickerItemId,
    pickerQty,
    setPickerQty,
    checklistItems,
    allChecked,
    isTemplateLoading,
    canComplete,
    selectableItems,
    handlePhotoUpload,
    toggleItem,
    handleAddPart,
    removePart,
    handleComplete,
    isCompleting: completeTaskMutation.isPending,
  };
};
