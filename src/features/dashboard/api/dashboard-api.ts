import { endOfWeek, startOfWeek } from "date-fns";
import { sortBy } from "lodash";

import { axiosInstance } from "@/shared/lib/api-client";
import type { components } from "@/shared/types/api-generated";

export type InventoryItem = components["schemas"]["InventoryItem"];
export type Notification = components["schemas"]["Notification"];
export type Task = components["schemas"]["Task"];
export type TaskStatus = components["schemas"]["Task"]["status"];

type InventoryListResponse = components["schemas"]["InventoryListResponse"];
type NotificationsListResponse = components["schemas"]["NotificationsListResponse"];
type TasksListResponse = components["schemas"]["TasksListResponse"];
type UnreadCountResponse = components["schemas"]["UnreadCountResponse"];

export type InventoryCategory = components["schemas"]["InventoryItem"]["category"];
export type InventoryStats = components["schemas"]["InventoryStatsResponse"]["data"];
export type CategoryStatsEntry = Omit<InventoryStats, "byCategory">;

const WIDGET_LIST_LIMIT = 25;

const fetchTotal = async (url: string, params?: Record<string, unknown>): Promise<number> => {
  const { data } = await axiosInstance.get<InventoryListResponse | TasksListResponse>(url, {
    params: { ...params, limit: 1 },
  });
  return data.meta.total;
};

export const getInventoryStats = async (): Promise<InventoryStats> => {
  const { data } =
    await axiosInstance.get<components["schemas"]["InventoryStatsResponse"]>("/inventory/stats");
  return data.data;
};

export const getTasksCount = (status: TaskStatus, assignedTo?: string) =>
  fetchTotal("/tasks", { status, ...(assignedTo ? { assignedTo } : {}) });

export const getOverdueTasksCount = (assignedTo?: string) =>
  fetchTotal("/tasks", { overdue: true, ...(assignedTo ? { assignedTo } : {}) });

export const getLowStockItems = async () => {
  const { data } = await axiosInstance.get<InventoryListResponse>("/inventory", {
    params: { status: "LOW_STOCK", limit: WIDGET_LIST_LIMIT, sortBy: "quantity", sortOrder: "asc" },
  });

  return { items: data.data, total: data.meta.total };
};

export const getOverdueTasks = async (assignedTo?: string): Promise<Task[]> => {
  const { data } = await axiosInstance.get<TasksListResponse>("/tasks", {
    params: { overdue: true, limit: WIDGET_LIST_LIMIT, ...(assignedTo ? { assignedTo } : {}) },
  });
  return data.data;
};

export const getDueThisWeekTasks = async (assignedTo?: string): Promise<Task[]> => {
  const now = new Date();
  const { data } = await axiosInstance.get<TasksListResponse>("/tasks", {
    params: {
      dueDateFrom: startOfWeek(now, { weekStartsOn: 1 }).toISOString(),
      dueDateTo: endOfWeek(now, { weekStartsOn: 1 }).toISOString(),
      limit: WIDGET_LIST_LIMIT,
      ...(assignedTo ? { assignedTo } : {}),
    },
  });
  return sortBy(data.data, (task) => (task.dueDate ? new Date(task.dueDate).getTime() : Infinity));
};

export const getRecentTasks = async (assignedTo?: string) => {
  const { data } = await axiosInstance.get<TasksListResponse>("/tasks", {
    params: {
      limit: WIDGET_LIST_LIMIT,
      sortBy: "createdAt",
      sortOrder: "desc",
      ...(assignedTo ? { assignedTo } : {}),
    },
  });

  return data.data;
};

export const getUnreadNotificationsCount = async () => {
  const { data } = await axiosInstance.get<UnreadCountResponse>("/notifications/unread-count");

  return data.data.count;
};

export const getRecentNotifications = async () => {
  const { data } = await axiosInstance.get<NotificationsListResponse>("/notifications", {
    params: { isRead: "false", limit: WIDGET_LIST_LIMIT },
  });

  return data.data;
};
