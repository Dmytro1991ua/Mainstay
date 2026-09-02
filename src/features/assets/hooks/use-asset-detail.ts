import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { getAsset } from "../api/assets.api";

import { useAssetDelete } from "./use-asset-delete";
import { useAssetForm } from "./use-asset-form";
import { useAssetPermissions } from "./use-asset-permissions";
import { ASSETS_KEY } from "./use-assets";

export const useAssetDetail = (assetId: string) => {
  const navigate = useNavigate();
  const { canManage, canDelete } = useAssetPermissions();

  const {
    data: asset,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: [ASSETS_KEY, assetId],
    queryFn: () => getAsset(assetId),
  });

  const { openEdit, form, isSaving, handleSave, sheetMode, closeSheet } = useAssetForm();
  const {
    openDelete,
    deleteTarget,
    handleDelete: _handleDelete,
    closeDelete,
    isDeleting,
  } = useAssetDelete();

  const handleDelete = async () => {
    try {
      await _handleDelete();
      navigate({ to: "/assets" });
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return {
    asset,
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
  };
};
