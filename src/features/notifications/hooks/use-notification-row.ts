import { useNavigate } from "@tanstack/react-router";

import { getNotificationTypeConfig } from "@/shared/lib/notification-config";

import { getNotificationNav } from "../utils";

import type { Notification } from "../api/notifications-api";

type Params = {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
};

export const useNotificationRow = ({ notification, onMarkRead, onDelete }: Params) => {
  const navigate = useNavigate();

  const nav = getNotificationNav(notification);

  const typeConfig = getNotificationTypeConfig(notification.type);
  const isInteractive = !!nav || !notification.isRead;

  const handleClick = () => {
    if (!notification.isRead) onMarkRead(notification.id);

    if (!nav) return;

    if ("params" in nav) {
      navigate({ to: nav.to, params: nav.params });
    } else {
      navigate({ to: nav.to, search: nav.search ?? {} });
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(notification.id);
  };

  return { typeConfig, nav, isInteractive, handleClick, handleDelete };
};
