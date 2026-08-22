import { useQuery } from "@tanstack/react-query";

import { useMutation } from "@/shared/hooks/use-crud";

import {
  createRecurringTask,
  deleteRecurringTask,
  fetchRecurringTasks,
  getRecurringTask,
  pauseRecurringTask,
  resumeRecurringTask,
  updateRecurringTask,
  type RecurringTaskListParams,
  type UpdateRecurringTaskInput,
} from "../api/recurring-tasks.api";

export const RECURRING_TASKS_KEY = "recurring-tasks";

export const useRecurringTasksQuery = (params?: RecurringTaskListParams) =>
  useQuery({
    queryKey: [RECURRING_TASKS_KEY, params],
    queryFn: () => fetchRecurringTasks(params),
  });

export const useRecurringTaskQuery = (id: string) =>
  useQuery({
    queryKey: [RECURRING_TASKS_KEY, id],
    queryFn: () => getRecurringTask(id),
  });

export const useCreateRecurringTask = () => useMutation(RECURRING_TASKS_KEY, createRecurringTask);

export const useUpdateRecurringTask = () =>
  useMutation(RECURRING_TASKS_KEY, ({ id, data }: { id: string; data: UpdateRecurringTaskInput }) =>
    updateRecurringTask(id, data),
  );

export const usePauseRecurringTask = () => useMutation(RECURRING_TASKS_KEY, pauseRecurringTask);

export const useResumeRecurringTask = () => useMutation(RECURRING_TASKS_KEY, resumeRecurringTask);

export const useDeleteRecurringTask = () => useMutation(RECURRING_TASKS_KEY, deleteRecurringTask);
