import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { useAuthStore } from "@/shared/stores/auth-store";

import { getTask } from "../api/tasks.api";

import { useTaskDelete } from "./use-task-delete";
import { useTaskForm } from "./use-task-form";
import { TASKS_KEY } from "./use-tasks";

export const useTaskDetail = (taskId: string) => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const roles = user?.roles ?? [];

  const isTechnician =
    roles.includes("TECHNICIAN") && !roles.some((r) => r === "ADMIN" || r === "MANAGER");
  const canManage = !isTechnician;
  const canDelete = roles.includes("ADMIN") || roles.includes("MANAGER");

  const {
    data: task,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: [TASKS_KEY, taskId],
    queryFn: () => getTask(taskId),
  });

  const canEditStatus =
    canManage || (isTechnician && task?.assignedTo === user?.id && task?.status !== "DONE");

  const { openEdit, form, isSaving, handleSave, sheetMode, closeSheet } = useTaskForm();
  const {
    openDelete,
    deleteTarget,
    handleDelete: _handleDelete,
    closeDelete,
    isDeleting,
  } = useTaskDelete();

  const handleDelete = async () => {
    try {
      await _handleDelete();
      navigate({ to: "/tasks" });
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return {
    task,
    isPending,
    isError,
    refetch,
    canManage,
    canDelete,
    canEditStatus,
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
