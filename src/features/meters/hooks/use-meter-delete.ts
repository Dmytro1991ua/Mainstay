import { useState } from "react";

import { getApiErrorMessage, getApiErrorStatus } from "@/shared/lib/api-error";
import { toast } from "@/shared/ui/toast";

import { useDeleteMeter } from "./use-meters";

import type { Meter } from "../api/meters.api";

export const useMeterDelete = () => {
  const deleteMutation = useDeleteMeter();

  const [deleteTarget, setDeleteTarget] = useState<Meter | null>(null);

  const openDelete = (meter: Meter) => setDeleteTarget(meter);

  const closeDelete = () => setDeleteTarget(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    const { name, id } = deleteTarget;

    try {
      await deleteMutation.mutateAsync(id);

      toast.success("Meter deleted", { description: `"${name}" was removed.` });
    } catch (err) {
      // 409: maintenance schedules still use this meter.
      if (getApiErrorStatus(err) === 409) {
        toast.error("Can't delete this meter", {
          description: "Maintenance schedules depend on it. Delete those schedules first.",
        });
      } else {
        toast.error("Failed to delete meter", { description: getApiErrorMessage(err) });
      }
    }

    closeDelete();
  };

  return {
    deleteTarget,
    openDelete,
    closeDelete,
    handleDelete,
    isDeleting: deleteMutation.isPending,
  };
};
