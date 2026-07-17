import { zodResolver } from "@hookform/resolvers/zod";
import { toNumber as _toNumber } from "lodash";
import { useState } from "react";

import { useFormState } from "@/shared/hooks/use-form-state";
import { toast } from "@/shared/ui/toast";

import { getApiErrorStatus } from "../utils";
import { FORM_DEFAULTS, inventoryFormSchema, type InventoryFormValues } from "../validation";

import { useCreateInventory, useUpdateInventory } from "./use-inventory";

import type { CreateInventoryItemInput, InventoryItem } from "../api/inventory.api";
import type { SheetMode } from "../types";

export const useInventoryForm = () => {
  const [sheetMode, setSheetMode] = useState<SheetMode | null>(null);

  const createMutation = useCreateInventory();
  const updateMutation = useUpdateInventory();

  const closeModal = () => setSheetMode(null);

  const { formState: form, onReset: closeSheet } = useFormState({
    initialValues: FORM_DEFAULTS,
    resolver: zodResolver(inventoryFormSchema),
    onCloseModal: closeModal,
  });

  const openAdd = () => {
    form.reset(FORM_DEFAULTS);
    setSheetMode({ type: "add" });
  };

  const openEdit = (item: InventoryItem) => {
    form.reset({
      name: item.name,
      serialNumber: item.serialNumber,
      category: item.category,
      quantity: String(item.quantity),
      minStockLevel: String(item.minStockLevel),
    });
    setSheetMode({ type: "edit", item });
  };

  const saveAdd = async (values: InventoryFormValues) => {
    try {
      await createMutation.mutateAsync({
        name: values.name,
        serialNumber: values.serialNumber,
        category: values.category as CreateInventoryItemInput["category"],
        quantity: _toNumber(values.quantity),
        minStockLevel: _toNumber(values.minStockLevel),
      });
      toast.success("Item added", { description: `"${values.name}" was added to inventory.` });
      closeSheet();
    } catch (err) {
      if (getApiErrorStatus(err) === 409) {
        toast.error("Serial number already taken", {
          description: "Use a unique serial number for this item.",
        });
      } else {
        toast.error("Failed to add item");
      }
    }
  };

  const saveEdit = async (values: InventoryFormValues, id: string) => {
    try {
      await updateMutation.mutateAsync({
        id,
        data: {
          name: values.name,
          category: values.category as CreateInventoryItemInput["category"],
          quantity: _toNumber(values.quantity),
          minStockLevel: _toNumber(values.minStockLevel),
        },
      });

      toast.success("Item updated", { description: `"${values.name}" was saved.` });

      closeSheet();
    } catch (e) {
      toast.error("Failed to update item", { description: (e as Error).message });
    }
  };

  const handleSave = form.handleSubmit(async (values) => {
    if (!sheetMode) return;

    if (sheetMode.type === "add") {
      await saveAdd(values);
    } else {
      await saveEdit(values, sheetMode.item.id);
    }
  });

  return {
    sheetMode,
    form,
    openAdd,
    openEdit,
    closeSheet,
    handleSave,
    isSaving: createMutation.isPending || updateMutation.isPending,
  };
};
