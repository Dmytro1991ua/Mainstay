import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createTaskComment, deleteTaskComment, fetchTaskComments } from "../api/comments.api";

const COMMENTS_KEY = "task-comments";
const commentsKey = (taskId: string) => [COMMENTS_KEY, taskId];

export const useTaskComments = (taskId: string) =>
  useQuery({
    queryKey: commentsKey(taskId),
    queryFn: () => fetchTaskComments(taskId),
    staleTime: 30_000,
  });

export const useCreateComment = (taskId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: string) => createTaskComment(taskId, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: commentsKey(taskId) }),
  });
};

export const useDeleteComment = (taskId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => deleteTaskComment(taskId, commentId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: commentsKey(taskId) }),
  });
};
