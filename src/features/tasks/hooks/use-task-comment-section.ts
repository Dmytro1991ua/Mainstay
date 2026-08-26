import { useState } from "react";

import { getApiErrorMessage } from "@/shared/lib/api-error";
import { useAuthStore } from "@/shared/stores/auth-store";
import { toast } from "@/shared/ui/toast";

import { useCreateComment, useDeleteComment, useTaskComments } from "./use-task-comments";

import type { TaskComment } from "../api/comments.api";

export const useTaskCommentSection = (taskId: string) => {
  const { data: comments, isPending, isError, refetch } = useTaskComments(taskId);
  const createMutation = useCreateComment(taskId);
  const deleteMutation = useDeleteComment(taskId);

  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.roles.includes("ADMIN") ?? false;

  const [pendingDelete, setPendingDelete] = useState<TaskComment | null>(null);

  const canDelete = (comment: TaskComment) => comment.author.id === user?.id || isAdmin;

  const addComment = async (body: string): Promise<boolean> => {
    try {
      await createMutation.mutateAsync(body);

      return true;
    } catch (error) {
      toast.error("Failed to add comment", { description: getApiErrorMessage(error) });

      return false;
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;

    try {
      await deleteMutation.mutateAsync(pendingDelete.id);

      toast.success("Comment deleted");
    } catch (error) {
      toast.error("Failed to delete comment", { description: getApiErrorMessage(error) });
    } finally {
      setPendingDelete(null);
    }
  };

  return {
    comments,
    isPending,
    isError,
    refetch,
    isSubmitting: createMutation.isPending,
    pendingDelete,
    setPendingDelete,
    canDelete,
    addComment,
    confirmDelete,
  };
};
