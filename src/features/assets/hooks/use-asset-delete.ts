import { useState } from "react";

import { toast } from "@/shared/ui/toast";

import { useDeleteAsset } from "./use-assets";

import type { Asset } from "../api/assets.api";

export const useAssetDelete = () => {
  const deleteMutation = useDeleteAsset();

  const [deleteTarget, setDeleteTarget] = useState<Asset | null>(null);

  const openDelete = (asset: Asset) => setDeleteTarget(asset);

  const closeDelete = () => setDeleteTarget(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    const { name, id } = deleteTarget;

    await deleteMutation.mutateAsync(id, {
      onSuccess: () => {
        toast.success("Asset deleted", { description: `"${name}" was removed.` });
        closeDelete();
      },
      onError: () => {
        toast.error("Failed to delete asset");
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
