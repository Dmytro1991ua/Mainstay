import type { PaginatedResponse } from "@/shared/hooks/use-crud";

import { NOTIFICATIONS_QUERY_KEY } from "./constants";

import type { Notification, NotificationType } from "./api/notifications-api";
import type { InfiniteData, QueryClient } from "@tanstack/react-query";

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

export const applyOptimistic = (
  queryClient: QueryClient,
  updater: (n: Notification) => Notification,
) => {
  queryClient.setQueriesData<InfiniteData<PaginatedResponse<Notification>>>(
    { queryKey: [NOTIFICATIONS_QUERY_KEY] },
    (old) => {
      if (!old) return old;

      return {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          data: page.data.map(updater),
        })),
      };
    },
  );
};
