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

export const getInventoryTotal = async () => {
  const { data } = await axiosInstance.get<InventoryListResponse>("/inventory", {
    params: { limit: 1 },
  });

  return data.meta.total;
};

export const getLowStockItems = async () => {
  const { data } = await axiosInstance.get<InventoryListResponse>("/inventory", {
    params: { lowStock: "true", limit: 10, sortBy: "quantity", sortOrder: "asc" },
  });

  return { items: data.data, total: data.meta.total };
};

export const getTasksCount = async (status: TaskStatus) => {
  const { data } = await axiosInstance.get<TasksListResponse>("/tasks", {
    params: { status, limit: 1 },
  });

  return data.meta.total;
};

export const getRecentTasks = async () => {
  const { data } = await axiosInstance.get<TasksListResponse>("/tasks", {
    params: { limit: 8, sortBy: "createdAt", sortOrder: "desc" },
  });

  return data.data;
};

export const getUnreadNotificationsCount = async () => {
  const { data } = await axiosInstance.get<UnreadCountResponse>("/notifications/unread-count");

  return data.data.count;
};

export const getRecentNotifications = async () => {
  const { data } = await axiosInstance.get<NotificationsListResponse>("/notifications", {
    params: { isRead: "false", limit: 5 },
  });

  return data.data;
};
