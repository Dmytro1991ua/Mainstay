import { axiosInstance } from "@/shared/lib/api-client";
import type { components } from "@/shared/types/api-generated";

export type RecurringTask = components["schemas"]["RecurringTask"];
export type RecurringTaskPriority = RecurringTask["priority"];
export type RecurringTaskCategory = NonNullable<RecurringTask["category"]>;
export type CreateRecurringTaskInput = components["schemas"]["CreateRecurringTaskInput"];
export type UpdateRecurringTaskInput = components["schemas"]["UpdateRecurringTaskInput"];

export type RecurringTaskListParams = {
  isActive?: boolean;
};

export const fetchRecurringTasks = async (params?: RecurringTaskListParams) => {
  const res = await axiosInstance.get<components["schemas"]["RecurringTasksListResponse"]>(
    "/recurring-tasks",
    { params },
  );
  return res.data.data;
};

export const getRecurringTask = async (id: string): Promise<RecurringTask> => {
  const res = await axiosInstance.get<components["schemas"]["RecurringTaskResponse"]>(
    `/recurring-tasks/${id}`,
  );
  return res.data.data;
};

export const createRecurringTask = async (data: CreateRecurringTaskInput) => {
  const res = await axiosInstance.post<components["schemas"]["RecurringTaskResponse"]>(
    "/recurring-tasks",
    data,
  );
  return res.data.data;
};

export const updateRecurringTask = async (id: string, data: UpdateRecurringTaskInput) => {
  const res = await axiosInstance.patch<components["schemas"]["RecurringTaskResponse"]>(
    `/recurring-tasks/${id}`,
    data,
  );
  return res.data.data;
};

export const pauseRecurringTask = async (id: string) => {
  const res = await axiosInstance.post<components["schemas"]["RecurringTaskResponse"]>(
    `/recurring-tasks/${id}/pause`,
  );
  return res.data.data;
};

export const resumeRecurringTask = async (id: string) => {
  const res = await axiosInstance.post<components["schemas"]["RecurringTaskResponse"]>(
    `/recurring-tasks/${id}/resume`,
  );
  return res.data.data;
};

export const deleteRecurringTask = async (id: string) => {
  await axiosInstance.delete(`/recurring-tasks/${id}`);
};
