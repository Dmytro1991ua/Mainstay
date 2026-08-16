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

const USERS_KEY = "users";

export const useTasksQuery = (params: TaskListParams) =>
  useInfiniteQueryList<Task, TaskListParams>(TASKS_KEY, params, fetchTasks);

export const useCreateTask = () =>
  useMutation(TASKS_KEY, createTask, { alsoInvalidate: [USERS_KEY] });

export const useUpdateTask = () =>
  useMutation(
    TASKS_KEY,
    ({ id, data }: { id: string; data: UpdateTaskInput }) => updateTask(id, data),
    { alsoInvalidate: [USERS_KEY] },
  );

export const useDeleteTask = () =>
  useMutation(TASKS_KEY, deleteTask, { alsoInvalidate: [USERS_KEY] });
