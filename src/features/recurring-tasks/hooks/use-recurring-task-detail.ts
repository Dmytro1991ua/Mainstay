import { useNavigate } from "@tanstack/react-router";

import { useAuthStore } from "@/shared/stores/auth-store";

import { useRecurringTaskForm } from "./use-recurring-task-form";
import { useRecurringTaskQuery } from "./use-recurring-tasks";
import { useScheduleActions } from "./use-schedule-actions";

export const useRecurringTaskDetail = (scheduleId: string) => {
  const navigate = useNavigate();
  const roles = useAuthStore((s) => s.user?.roles ?? []);

  const canManage = roles.includes("ADMIN") || roles.includes("MANAGER");

  const { data: schedule, isPending, isError, refetch } = useRecurringTaskQuery(scheduleId);

  const { sheetMode, form, openEdit, closeSheet, handleSave, isSaving } = useRecurringTaskForm();

  const { handlePause, handleResume, handleDelete, isPausing, isResuming, isDeleting } =
    useScheduleActions();

  return {
    schedule,
    isPending,
    isError,
    refetch,
    canManage,
    sheetMode,
    form,
    openEdit,
    closeSheet,
    handleSave,
    isSaving,
    handlePause: () => schedule && handlePause(schedule),
    handleResume: () => schedule && handleResume(schedule),
    handleDelete: () =>
      schedule && handleDelete(schedule, () => navigate({ to: "/recurring-tasks" })),
    isPausing,
    isResuming,
    isDeleting,
  };
};
