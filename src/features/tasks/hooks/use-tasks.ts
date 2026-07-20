import { useInfiniteQueryList, useMutation } from "@/shared/hooks/use-crud";

import {
  createTask,
  deleteTask,
  fetchTasks,
  updateTask,
  type Task,
  type TaskListParams,
  type UpdateTaskInput,
} from "../api/tasks.api";

export const TASKS_KEY = "tasks";

export const useTasksQuery = (params: TaskListParams) =>
  useInfiniteQueryList<Task, TaskListParams>(TASKS_KEY, params, fetchTasks);

export const useCreateTask = () => useMutation(TASKS_KEY, createTask);

export const useUpdateTask = () =>
  useMutation(TASKS_KEY, ({ id, data }: { id: string; data: UpdateTaskInput }) =>
    updateTask(id, data),
  );

export const useDeleteTask = () => useMutation(TASKS_KEY, deleteTask);
