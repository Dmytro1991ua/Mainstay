import { useState } from "react";

import { getApiErrorMessage } from "@/shared/lib/api-error";
import { toast } from "@/shared/ui/toast";

import { useDeleteDowntime } from "./use-downtime";

import type { DowntimeEvent } from "../api/downtime.api";

export const useDeleteDowntimeEvent = (assetId: string) => {
  const [target, setTarget] = useState<DowntimeEvent | null>(null);
  const mutation = useDeleteDowntime(assetId);

  const close = () => setTarget(null);

  const confirm = async () => {
    if (!target) return;

    try {
      await mutation.mutateAsync(target.id);

      toast.success("Downtime event deleted");
    } catch (error) {
      toast.error("Failed to delete downtime event", { description: getApiErrorMessage(error) });
    } finally {
      close();
    }
  };

  return { target, open: setTarget, close, confirm };
};
