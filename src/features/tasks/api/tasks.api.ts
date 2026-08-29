import { axiosInstance } from "@/shared/lib/api-client";
import type { components } from "@/shared/types/api-generated";
import { calcUploadPercent } from "@/shared/utils";

export type Task = components["schemas"]["Task"];
export type TaskStatus = Task["status"];
export type TaskCategory = NonNullable<Task["category"]>;
export type ChecklistTemplate = components["schemas"]["ChecklistTemplate"];
export type CreateTaskInput = components["schemas"]["CreateTaskInput"];
export type UpdateTaskInput = components["schemas"]["UpdateTaskInput"];
export type CompleteTaskInput = components["schemas"]["CompleteTaskInput"];

// POST /tasks/:id/cancel is live (ADMIN/MANAGER, requires a reason) but not yet in the
// OpenAPI spec, so it isn't in the generated types. Typed locally until the spec documents it.
export type CancelTaskInput = { reason: string };

export type TaskPriority = Task["priority"];

export type TaskListParams = {
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "status" | "title" | "priority";
  sortOrder?: "asc" | "desc";
  status?: TaskStatus;
  priority?: TaskPriority;
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

const uploadPhoto = async (
  id: string,
  endpoint: "before-photo" | "after-photo",
  file: File,
  onProgress?: (percent: number) => void,
): Promise<Task> => {
  const form = new FormData();
  form.append("photo", file);
  // No Content-Type header — axios detects FormData and sets it with the correct boundary automatically.
  // Server uses POST (not PATCH as documented in the OpenAPI spec).
  const res = await axiosInstance.post<components["schemas"]["TaskResponse"]>(
    `/tasks/${id}/${endpoint}`,
    form,
    onProgress ? { onUploadProgress: (e) => onProgress(calcUploadPercent(e)) } : undefined,
  );
  return res.data.data;
};

export const uploadBeforePhoto = (id: string, file: File, onProgress?: (percent: number) => void) =>
  uploadPhoto(id, "before-photo", file, onProgress);
export const uploadAfterPhoto = (id: string, file: File) => uploadPhoto(id, "after-photo", file);

export const completeTask = async (id: string, data: CompleteTaskInput): Promise<Task> => {
  const res = await axiosInstance.post<components["schemas"]["TaskResponse"]>(
    `/tasks/${id}/complete`,
    data,
  );
  return res.data.data;
};

export const cancelTask = async (id: string, data: CancelTaskInput): Promise<Task> => {
  const res = await axiosInstance.post<components["schemas"]["TaskResponse"]>(
    `/tasks/${id}/cancel`,
    data,
  );
  return res.data.data;
};

export const getChecklistTemplate = async (category: string): Promise<ChecklistTemplate> => {
  const res = await axiosInstance.get<components["schemas"]["ChecklistTemplateResponse"]>(
    `/checklist-templates/${category}`,
  );
  return res.data.data;
};
