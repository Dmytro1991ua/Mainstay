import type { PaginatedResponse } from "@/shared/hooks/use-crud";

import { NOTIFICATIONS_QUERY_KEY } from "./constants";

import type { Notification, NotificationType } from "./api/notifications-api";
import type { InfiniteData, QueryClient } from "@tanstack/react-query";

type ListRoute = "/inventory" | "/tasks" | "/work-order-requests" | "/reorders";

export type NotificationNav =
  | { to: ListRoute; search?: { search: string } }
  | { to: "/assets/$assetId"; params: { assetId: string } };

const extractQuotedName = (message: string): string | undefined =>
  message.match(/[""](.+?)[""]/)?.[1];

// Most notifications open a list, pre-filtered by the name quoted in the message.
const toList =
  (to: ListRoute) =>
  (notification: Notification): NotificationNav => {
    const search = extractQuotedName(notification.message);

    return { to, search: search ? { search } : undefined };
  };

// Warranty alerts open the asset itself: the warranty date the alert is about is on its detail
// page, and this doesn't depend on the asset name being quoted in the message.
const toAsset = (_: Notification, entityId: string): NotificationNav => ({
  to: "/assets/$assetId",
  params: { assetId: entityId },
});

const NAV_TARGET: Record<
  NotificationType,
  (notification: Notification, entityId: string) => NotificationNav
> = {
  LOW_STOCK: toList("/inventory"),
  OUT_OF_STOCK: toList("/inventory"),
  TASK_OVERDUE: toList("/tasks"),
  TASK_CANCELLED: toList("/tasks"),
  TASK_DUE_SOON: toList("/tasks"),
  WORK_ORDER_APPROVED: toList("/work-order-requests"),
  WORK_ORDER_REJECTED: toList("/work-order-requests"),
  REORDER_RAISED: toList("/reorders"),
  WARRANTY_EXPIRING: toAsset,
};

export const getNotificationNav = (notification: Notification): NotificationNav | null => {
  if (!notification.relatedEntityId) return null;

  return NAV_TARGET[notification.type](notification, notification.relatedEntityId);
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
