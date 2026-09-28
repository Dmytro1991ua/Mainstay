import { useState } from "react";

import { getApiErrorMessage, getApiErrorStatus } from "@/shared/lib/api-error";
import { toast } from "@/shared/ui/toast";

import { useCreateReorder } from "./use-reorders";

export const useReorderForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inventoryItemId, setInventoryItemId] = useState("");

  const createMutation = useCreateReorder();

  const openSheet = () => {
    setInventoryItemId("");
    setIsOpen(true);
  };

  const closeSheet = () => setIsOpen(false);

  const handleSubmit = async () => {
    if (!inventoryItemId) return;

    try {
      await createMutation.mutateAsync({ inventoryItemId });

      toast.success("Reorder raised");

      closeSheet();
    } catch (err) {
      if (getApiErrorStatus(err) === 409) {
        toast.error("Reorder already open", {
          description: "This item already has an open reorder.",
        });
      } else {
        toast.error("Failed to raise reorder", { description: getApiErrorMessage(err) });
      }
    }
  };

  return {
    isOpen,
    openSheet,
    closeSheet,
    inventoryItemId,
    setInventoryItemId,
    handleSubmit,
    isSaving: createMutation.isPending,
  };
};
