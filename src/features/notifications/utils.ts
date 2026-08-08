import type { Notification, NotificationType } from "./api/notifications-api";

type NotificationNav = {
  to: "/inventory" | "/tasks";
  search?: { search: string };
};

const NAV_TARGET: Record<NotificationType, NotificationNav["to"]> = {
  LOW_STOCK: "/inventory",
  OUT_OF_STOCK: "/inventory",
  TASK_OVERDUE: "/tasks",
};

const extractQuotedName = (message: string): string | undefined =>
  message.match(/[""](.+?)[""]/)?.[1];

export const getNotificationNav = (notification: Notification): NotificationNav | null => {
  if (!notification.relatedEntityId) return null;

  const search = extractQuotedName(notification.message);

  return { to: NAV_TARGET[notification.type], search: search ? { search } : undefined };
};
