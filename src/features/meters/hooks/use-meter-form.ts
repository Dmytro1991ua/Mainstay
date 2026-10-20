import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import { useFormState } from "@/shared/hooks/use-form-state";
import { getApiErrorMessage, getApiErrorStatus } from "@/shared/lib/api-error";
import { toast } from "@/shared/ui/toast";

import { METER_FORM_DEFAULTS, meterFormSchema, type MeterFormValues } from "../validation";

import { useCreateMeter, useUpdateMeter } from "./use-meters";

import type { Meter } from "../api/meters.api";
import type { SheetMode } from "../types";

// An asset can't have two meters with the same name (409).
const notifyDuplicateName = () =>
  toast.error("Meter name already used", {
    description: "This asset already has a meter with that name.",
  });

export const useMeterForm = (assetId: string) => {
  const [sheetMode, setSheetMode] = useState<SheetMode | null>(null);

  const createMutation = useCreateMeter();
  const updateMutation = useUpdateMeter();

  const { formState: form, onReset: closeSheet } = useFormState({
    initialValues: METER_FORM_DEFAULTS,
    resolver: zodResolver(meterFormSchema),
    onCloseModal: () => setSheetMode(null),
  });

  const openAdd = () => {
    form.reset(METER_FORM_DEFAULTS);
    setSheetMode({ type: "add" });
  };

  const openEdit = (meter: Meter) => {
    form.reset({
      name: meter.name,
      unit: meter.unit,
      initialReading: String(meter.currentReading),
    });
    setSheetMode({ type: "edit", meter });
  };

  const saveAdd = async (values: MeterFormValues) => {
    try {
      await createMutation.mutateAsync({
        assetId,
        name: values.name,
        unit: values.unit,
        // The server does not coerce strings, so send a real number.
        initialReading: Number(values.initialReading),
      });

      toast.success("Meter added", { description: `"${values.name}" was added.` });

      closeSheet();
    } catch (err) {
      if (getApiErrorStatus(err) === 409) {
        notifyDuplicateName();
      } else {
        toast.error("Failed to add meter", { description: getApiErrorMessage(err) });
      }
    }
  };

  const saveEdit = async (values: MeterFormValues, id: string) => {
    try {
      // Only the name can change; the unit is fixed after creation.
      await updateMutation.mutateAsync({ id, data: { name: values.name } });

      toast.success("Meter renamed", { description: `Now called "${values.name}".` });

      closeSheet();
    } catch (err) {
      if (getApiErrorStatus(err) === 409) {
        notifyDuplicateName();
      } else {
        toast.error("Failed to rename meter", { description: getApiErrorMessage(err) });
      }
    }
  };

  const handleSave = form.handleSubmit(async (values) => {
    if (!sheetMode) return;

    if (sheetMode.type === "add") {
      await saveAdd(values);
    } else {
      await saveEdit(values, sheetMode.meter.id);
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
