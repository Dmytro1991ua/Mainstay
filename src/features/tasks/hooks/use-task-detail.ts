import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { getApiErrorMessage } from "@/shared/lib/api-error";
import { useAuthStore } from "@/shared/stores/auth-store";
import { toast } from "@/shared/ui/toast";

import { getTask } from "../api/tasks.api";
import { isTaskClosedStatus } from "../utils";

import { useTaskDelete } from "./use-task-delete";
import { useTaskForm } from "./use-task-form";
import { TASKS_KEY, useUploadBeforePhoto } from "./use-tasks";

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

  const isTerminal = isTaskClosedStatus(task?.status ?? "");

  const canEditStatus =
    !isTerminal && (canManage || (isTechnician && task?.assignedTo === user?.id));

  const canComplete =
    task?.status === "IN_PROGRESS" &&
    (canManage || (isTechnician && task?.assignedTo === user?.id));

  const canCancel = !isTerminal && canManage;

  const canUploadBeforePhoto =
    task?.status === "IN_PROGRESS" &&
    (canManage || (isTechnician && task?.assignedTo === user?.id));

  const { openEdit, form, isSaving, handleSave, sheetMode, closeSheet } = useTaskForm();
  const {
    openDelete,
    deleteTarget,
    handleDelete: _handleDelete,
    closeDelete,
    isDeleting,
  } = useTaskDelete();

  const uploadBeforePhotoMutation = useUploadBeforePhoto();

  const handleUploadBeforePhoto = async (file: File) => {
    if (!task) return;

    try {
      await uploadBeforePhotoMutation.mutateAsync({ id: task.id, file });
      toast.success("Before photo uploaded");
    } catch (error) {
      toast.error("Failed to upload photo", { description: getApiErrorMessage(error) });
    }
  };

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
    isTerminal,
    canManage,
    canDelete,
    canEditStatus,
    canComplete,
    canCancel,
    canUploadBeforePhoto,
    isUploadingBeforePhoto: uploadBeforePhotoMutation.isPending,
    handleUploadBeforePhoto,
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
