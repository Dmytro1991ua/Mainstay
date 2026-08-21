import { useInfiniteQueryList, useMutation } from "@/shared/hooks/use-crud";

import {
  cancelTask,
  completeTask,
  createTask,
  deleteTask,
  fetchTasks,
  updateTask,
  uploadAfterPhoto,
  uploadBeforePhoto,
  type CancelTaskInput,
  type CompleteTaskInput,
  type Task,
  type TaskListParams,
  type UpdateTaskInput,
} from "../api/tasks.api";

export const TASKS_KEY = "tasks";

const USERS_KEY = "users";
const INVENTORY_KEY = "inventory";

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

export const useUploadBeforePhoto = () =>
  useMutation(TASKS_KEY, ({ id, file }: { id: string; file: File }) => uploadBeforePhoto(id, file));

export const useUploadAfterPhoto = () =>
  useMutation(TASKS_KEY, ({ id, file }: { id: string; file: File }) => uploadAfterPhoto(id, file));

export const useCompleteTask = () =>
  useMutation(
    TASKS_KEY,
    ({ id, data }: { id: string; data: CompleteTaskInput }) => completeTask(id, data),
    { alsoInvalidate: [USERS_KEY, INVENTORY_KEY] },
  );

export const useCancelTask = () =>
  useMutation(
    TASKS_KEY,
    ({ id, data }: { id: string; data: CancelTaskInput }) => cancelTask(id, data),
    { alsoInvalidate: [USERS_KEY] },
  );
