import { useId, useState } from "react";

import { FILTER_TABS } from "../config";

import { useNotifications } from "./use-notifications";

import type { NotificationFilter } from "../config";

export const useNotificationsList = () => {
  const uid = useId().replaceAll(":", "");
  const scrollId = `notifications-scroll-${uid}`;

  const [activeTab, setActiveTab] = useState<NotificationFilter>("ALL");

  const activeParams = FILTER_TABS.find((t) => t.key === activeTab)?.params;

  const { notifications, isLoading, hasNextPage, fetchNextPage, markRead, markAll } =
    useNotifications(activeParams);

  const unreadCount = useNotifications({ isRead: "false" }).notifications.length;

  return {
    scrollId,
    activeTab,
    setActiveTab,
    notifications,
    isLoading,
    hasNextPage,
    fetchNextPage,
    markRead,
    markAll,
    unreadCount,
  };
};
