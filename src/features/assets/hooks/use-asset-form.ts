import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import { useFormState } from "@/shared/hooks/use-form-state";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { toast } from "@/shared/ui/toast";

import { getApiErrorStatus } from "../utils";
import { FORM_DEFAULTS, assetFormSchema, type AssetFormValues } from "../validation";

import { useCreateAsset, useUpdateAsset } from "./use-assets";

import type { Asset, CreateAssetInput } from "../api/assets.api";
import type { SheetMode } from "../types";

const toIsoDate = (value: string) => (value ? new Date(value).toISOString() : undefined);

export const useAssetForm = () => {
  const [sheetMode, setSheetMode] = useState<SheetMode | null>(null);

  const createMutation = useCreateAsset();
  const updateMutation = useUpdateAsset();

  const closeModal = () => setSheetMode(null);

  const { formState: form, onReset: closeSheet } = useFormState({
    initialValues: FORM_DEFAULTS,
    resolver: zodResolver(assetFormSchema),
    onCloseModal: closeModal,
  });

  const openAdd = () => {
    form.reset(FORM_DEFAULTS);

    setSheetMode({ type: "add" });
  };

  const openEdit = (asset: Asset) => {
    form.reset({
      name: asset.name,
      serialNumber: asset.serialNumber,
      category: asset.category,
      location: asset.location,
      status: asset.status,
      manufacturer: asset.manufacturer ?? "",
      model: asset.model ?? "",
      installDate: asset.installDate ? asset.installDate.slice(0, 10) : "",
    });
    setSheetMode({ type: "edit", asset });
  };

  const saveAdd = async (values: AssetFormValues) => {
    try {
      await createMutation.mutateAsync({
        name: values.name,
        serialNumber: values.serialNumber,
        category: values.category as CreateAssetInput["category"],
        location: values.location,
        status: values.status,
        manufacturer: values.manufacturer || undefined,
        model: values.model || undefined,
        installDate: toIsoDate(values.installDate),
      });

      toast.success("Asset added", { description: `"${values.name}" was added.` });

      closeSheet();
    } catch (err) {
      if (getApiErrorStatus(err) === 409) {
        toast.error("Serial number already taken", {
          description: "Use a unique serial number for this asset.",
        });
      } else {
        toast.error("Failed to add asset", { description: getApiErrorMessage(err) });
      }
    }
  };

  const saveEdit = async (values: AssetFormValues, id: string) => {
    try {
      await updateMutation.mutateAsync({
        id,
        data: {
          name: values.name,
          category: values.category as CreateAssetInput["category"],
          location: values.location,
          status: values.status,
          manufacturer: values.manufacturer || null,
          model: values.model || null,
          installDate: toIsoDate(values.installDate) ?? null,
        },
      });

      toast.success("Asset updated", { description: `"${values.name}" was saved.` });

      closeSheet();
    } catch (e) {
      toast.error("Failed to update asset", { description: getApiErrorMessage(e) });
    }
  };

  const handleSave = form.handleSubmit(async (values) => {
    if (!sheetMode) return;

    if (sheetMode.type === "add") {
      await saveAdd(values);
    } else {
      await saveEdit(values, sheetMode.asset.id);
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
