import { useState } from "react";

import { toast } from "@/shared/ui/toast";

import { useDeleteTask } from "./use-tasks";

import type { Task } from "../api/tasks.api";

export const useTaskDelete = () => {
  const deleteMutation = useDeleteTask();

  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);

  const openDelete = (task: Task) => setDeleteTarget(task);
  const closeDelete = () => setDeleteTarget(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const { title, id } = deleteTarget;

    await deleteMutation.mutateAsync(id, {
      onSuccess: () => {
        toast.success("Task deleted", { description: `"${title}" was removed.` });
        closeDelete();
      },
      onError: () => {
        toast.error("Failed to delete task");
        closeDelete();
      },
    });
  };

  return {
    deleteTarget,
    openDelete,
    closeDelete,
    handleDelete,
    isDeleting: deleteMutation.isPending,
  };
};
