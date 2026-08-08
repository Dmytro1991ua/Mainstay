import type { PaginatedResponse } from "@/shared/hooks/use-crud";
import { axiosInstance } from "@/shared/lib/api-client";
import type { components } from "@/shared/types/api-generated";

export type Notification = components["schemas"]["Notification"];
export type NotificationType = Notification["type"];

export type NotificationsParams = {
  page: number;
  limit?: number;
  type?: NotificationType;
  isRead?: "true" | "false";
};

const PAGE_SIZE = 20;

export const getNotifications = async ({
  page,
  limit = PAGE_SIZE,
  type,
  isRead,
}: NotificationsParams): Promise<PaginatedResponse<Notification>> => {
  const { data } = await axiosInstance.get<{ success: true } & PaginatedResponse<Notification>>(
    "/notifications",
    { params: { page, limit, type, isRead } },
  );
  return { data: data.data, meta: data.meta };
};

export const markNotificationRead = async (id: string): Promise<void> => {
  await axiosInstance.patch(`/notifications/${id}`, { isRead: true });
};

export const markAllNotificationsRead = async (): Promise<void> => {
  await axiosInstance.patch("/notifications/read-all");
};

export const deleteNotification = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/notifications/${id}`);
};
