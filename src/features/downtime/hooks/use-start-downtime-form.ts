import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import { useFormState } from "@/shared/hooks/use-form-state";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { toast } from "@/shared/ui/toast";

import { toIsoDateTime } from "../utils";
import {
  START_DOWNTIME_DEFAULTS,
  startDowntimeSchema,
  type StartDowntimeFormValues,
} from "../validation";

import { useStartDowntime } from "./use-downtime";

export const useStartDowntimeForm = (assetId: string) => {
  const [isOpen, setIsOpen] = useState(false);
  const mutation = useStartDowntime(assetId);

  const { formState: form } = useFormState<StartDowntimeFormValues>({
    initialValues: START_DOWNTIME_DEFAULTS,
    resolver: zodResolver(startDowntimeSchema),
  });

  const open = () => {
    form.reset(START_DOWNTIME_DEFAULTS);
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  const save = form.handleSubmit(async ({ reason, startedAt, note }) => {
    try {
      await mutation.mutateAsync({
        reason,
        startedAt: toIsoDateTime(startedAt),
        note: note || undefined,
      });

      toast.success("Downtime recorded", { description: "The asset is now marked as down." });

      close();
    } catch (error) {
      // 409 covers "already down" and "overlaps earlier downtime"; the server message says which.
      toast.error("Failed to record downtime", { description: getApiErrorMessage(error) });
    }
  });

  return { isOpen, form, open, close, save, isSaving: mutation.isPending };
};
