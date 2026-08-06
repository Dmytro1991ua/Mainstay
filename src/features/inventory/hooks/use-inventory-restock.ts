import { useState } from "react";

import { toast } from "@/shared/ui/toast";

import { useRestockInventory } from "./use-inventory";

import type { InventoryItem } from "../api/inventory.api";

export const useInventoryRestock = () => {
  const restockMutation = useRestockInventory();
  const [restockTarget, setRestockTarget] = useState<InventoryItem | null>(null);
  const [quantityToAdd, setQuantityToAdd] = useState(1);

  const openRestock = (item: InventoryItem) => {
    setRestockTarget(item);
    setQuantityToAdd(1);
  };

  const closeRestock = () => setRestockTarget(null);

  const handleRestock = async () => {
    if (!restockTarget || quantityToAdd < 1) return;

    const { name, id } = restockTarget;

    await restockMutation.mutateAsync(
      { id, quantityToAdd },
      {
        onSuccess: () => {
          toast.success("Item restocked", {
            description: `Added ${quantityToAdd} unit${quantityToAdd !== 1 ? "s" : ""} to "${name}".`,
          });
          closeRestock();
        },
        onError: () => {
          toast.error("Failed to restock item");
          closeRestock();
        },
      },
    );
  };

  return {
    restockTarget,
    quantityToAdd,
    setQuantityToAdd,
    openRestock,
    closeRestock,
    handleRestock,
    isRestocking: restockMutation.isPending,
  };
};
