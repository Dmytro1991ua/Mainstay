import { axiosInstance } from "@/shared/lib/api-client";
import type { components } from "@/shared/types/api-generated";

export type Task = components["schemas"]["Task"];
export type TaskStatus = Task["status"];
export type CreateTaskInput = components["schemas"]["CreateTaskInput"];
export type UpdateTaskInput = components["schemas"]["UpdateTaskInput"];

export type TaskListParams = {
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "status" | "title";
  sortOrder?: "asc" | "desc";
  status?: TaskStatus;
  assignedTo?: string;
  search?: string;
  overdue?: boolean;
};

export const fetchTasks = async (params: TaskListParams) => {
  const res = await axiosInstance.get<components["schemas"]["TasksListResponse"]>("/tasks", {
    params,
  });

  return res.data;
};

export const createTask = async (data: CreateTaskInput) => {
  const res = await axiosInstance.post<components["schemas"]["TaskResponse"]>("/tasks", data);
  return res.data.data;
};

export const updateTask = async (id: string, data: UpdateTaskInput) => {
  const res = await axiosInstance.patch<components["schemas"]["TaskResponse"]>(
    `/tasks/${id}`,
    data,
  );
  return res.data.data;
};

export const getTask = async (id: string): Promise<Task> => {
  const res = await axiosInstance.get<components["schemas"]["TaskResponse"]>(`/tasks/${id}`);
  return res.data.data;
};

export const deleteTask = async (id: string) => {
  await axiosInstance.delete(`/tasks/${id}`);
};
