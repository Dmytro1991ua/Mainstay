import { getApiErrorMessage } from "@/shared/lib/api-error";
import { toast } from "@/shared/ui/toast";

import {
  useDeleteRecurringTask,
  usePauseRecurringTask,
  useResumeRecurringTask,
} from "./use-recurring-tasks";

import type { RecurringTask } from "../api/recurring-tasks.api";

export const useScheduleActions = () => {
  const pauseMutation = usePauseRecurringTask();
  const resumeMutation = useResumeRecurringTask();
  const deleteMutation = useDeleteRecurringTask();

  const handlePause = async (schedule: RecurringTask) => {
    try {
      await pauseMutation.mutateAsync(schedule.id);
      toast.success("Schedule paused", {
        description: `"${schedule.title}" will no longer generate tasks.`,
      });
    } catch (error) {
      toast.error("Failed to pause schedule", { description: getApiErrorMessage(error) });
    }
  };

  const handleResume = async (schedule: RecurringTask) => {
    try {
      await resumeMutation.mutateAsync(schedule.id);
      toast.success("Schedule resumed", { description: `"${schedule.title}" is now active.` });
    } catch (error) {
      toast.error("Failed to resume schedule", { description: getApiErrorMessage(error) });
    }
  };

  const handleDelete = async (schedule: RecurringTask, onSuccess?: () => void) => {
    try {
      await deleteMutation.mutateAsync(schedule.id);
      toast.success("Schedule deleted", { description: `"${schedule.title}" was removed.` });
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to delete schedule", { description: getApiErrorMessage(error) });
    }
  };

  return {
    handlePause,
    handleResume,
    handleDelete,
    isPausing: pauseMutation.isPending,
    isResuming: resumeMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
