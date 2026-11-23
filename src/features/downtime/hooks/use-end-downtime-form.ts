import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import { useFormState } from "@/shared/hooks/use-form-state";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { toast } from "@/shared/ui/toast";

import { toIsoDateTime } from "../utils";
import {
  END_DOWNTIME_DEFAULTS,
  endDowntimeSchema,
  type EndDowntimeFormValues,
} from "../validation";

import { useEndDowntime } from "./use-downtime";

import type { DowntimeEvent } from "../api/downtime.api";

export const useEndDowntimeForm = (assetId: string) => {
  const [target, setTarget] = useState<DowntimeEvent | null>(null);
  const mutation = useEndDowntime(assetId);

  const { formState: form } = useFormState<EndDowntimeFormValues>({
    initialValues: END_DOWNTIME_DEFAULTS,
    resolver: zodResolver(endDowntimeSchema),
  });

  const open = (event: DowntimeEvent) => {
    form.reset(END_DOWNTIME_DEFAULTS);
    setTarget(event);
  };

  const close = () => setTarget(null);

  const save = form.handleSubmit(async ({ endedAt }) => {
    if (!target) return;

    const endedAtIso = toIsoDateTime(endedAt);

    if (endedAtIso && new Date(endedAtIso) <= new Date(target.startedAt)) {
      form.setError("endedAt", { message: "Must be after the downtime started" });

      return;
    }

    try {
      await mutation.mutateAsync({ downtimeId: target.id, data: { endedAt: endedAtIso } });

      toast.success("Asset back in service", {
        description: "The asset is now marked as operational.",
      });

      close();
    } catch (error) {
      toast.error("Failed to end downtime", { description: getApiErrorMessage(error) });
    }
  });

  return { target, form, open, close, save, isSaving: mutation.isPending };
};
