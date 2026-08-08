import { useId, useState } from "react";

import { FILTER_TABS } from "../config";

import { useNotifications } from "./use-notifications";

import type { NotificationFilter } from "../config";

export const useNotificationsList = () => {
  const uid = useId().replaceAll(":", "");
  const scrollId = `notifications-scroll-${uid}`;

  const [activeTab, setActiveTab] = useState<NotificationFilter>("ALL");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const activeParams = FILTER_TABS.find((t) => t.key === activeTab)?.params;

  const {
    notifications,
    isLoading,
    hasNextPage,
    fetchNextPage,
    markRead,
    markAll,
    deleteNotification,
  } = useNotifications(activeParams);

  const unreadCount = useNotifications({ isRead: "false" }).notifications.length;

  const handleDeleteConfirm = () => {
    if (deleteTarget) deleteNotification(deleteTarget);
    setDeleteTarget(null);
  };

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
    deleteTarget,
    setDeleteTarget,
    handleDeleteConfirm,
    unreadCount,
  };
};
