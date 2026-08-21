import { useState } from "react";

import { getApiErrorMessage } from "@/shared/lib/api-error";
import { toast } from "@/shared/ui/toast";

import { useCancelTask } from "./use-tasks";

import type { Task } from "../api/tasks.api";

export const useTaskCancel = () => {
  const cancelMutation = useCancelTask();

  const [cancelTarget, setCancelTarget] = useState<Task | null>(null);

  const openCancel = (task: Task) => setCancelTarget(task);
  const closeCancel = () => setCancelTarget(null);

  const handleCancel = async (cancellationReason: string) => {
    if (!cancelTarget) return;

    const { title, id } = cancelTarget;

    try {
      await cancelMutation.mutateAsync({ id, data: { reason: cancellationReason } });

      toast.success("Task cancelled", { description: `"${title}" has been cancelled.` });

      closeCancel();
    } catch (error) {
      toast.error("Failed to cancel task", { description: getApiErrorMessage(error) });
    }
  };

  return {
    cancelTarget,
    openCancel,
    closeCancel,
    handleCancel,
    isCancelling: cancelMutation.isPending,
  };
};
