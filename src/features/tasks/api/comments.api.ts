import { axiosInstance } from "@/shared/lib/api-client";

export type CommentAuthor = {
  id: string;
  userName: string;
  email: string;
};

export type TaskComment = {
  id: string;
  taskId: string;
  body: string;
  author: CommentAuthor;
  createdAt: string;
};

export const COMMENT_MAX_LENGTH = 2000;

type CommentsListResponse = { success: true; data: TaskComment[] };
type CommentResponse = { success: true; data: TaskComment };

export const fetchTaskComments = async (taskId: string): Promise<TaskComment[]> => {
  const res = await axiosInstance.get<CommentsListResponse>(`/tasks/${taskId}/comments`);
  return res.data.data;
};

export const createTaskComment = async (taskId: string, body: string): Promise<TaskComment> => {
  const res = await axiosInstance.post<CommentResponse>(`/tasks/${taskId}/comments`, { body });
  return res.data.data;
};

export const deleteTaskComment = async (taskId: string, commentId: string): Promise<void> => {
  await axiosInstance.delete(`/tasks/${taskId}/comments/${commentId}`);
};
