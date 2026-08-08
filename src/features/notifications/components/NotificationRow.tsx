import { Trash2 } from "lucide-react";

import { NOTIFICATION_TYPE_CONFIG } from "@/shared/lib/notification-config";
import { cn } from "@/shared/lib/utils";
import { formatTimeAgo } from "@/shared/utils";

import type { Notification } from "../api/notifications-api";

type Props = {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
};

export const NotificationRow = ({ notification, onMarkRead, onDelete }: Props) => {
  const {
    icon: Icon,
    iconClass,
    bgClass,
    label,
    unreadRowBg,
    unreadBorderClass,
  } = NOTIFICATION_TYPE_CONFIG[notification.type];

  const handleMarkRead = () => {
    if (!notification.isRead) onMarkRead(notification.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(notification.id);
  };

  return (
    <div
      role={!notification.isRead ? "button" : undefined}
      tabIndex={!notification.isRead ? 0 : undefined}
      onClick={handleMarkRead}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleMarkRead()}
      className={cn(
        "group flex items-start gap-3 border-b border-border border-l-2 border-l-transparent px-4 py-3.5 last:border-b-0 transition-colors",
        !notification.isRead && cn("cursor-pointer", unreadRowBg, unreadBorderClass),
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          bgClass,
        )}
      >
        <Icon className={cn("h-4 w-4", iconClass)} strokeWidth={1.75} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className={cn("text-[11px] font-semibold uppercase tracking-wide", iconClass)}>
            {label}
          </span>
          <span className="text-[11.5px] text-text-3">
            · {formatTimeAgo(notification.createdAt)}
          </span>
        </div>
        <p className="mt-0.5 text-[13.5px] leading-snug text-text">{notification.message}</p>
      </div>
      <div className="mt-1 flex shrink-0 items-center gap-1.5">
        {!notification.isRead && <span className="block h-2 w-2 rounded-full bg-accent" />}
        <button
          type="button"
          onClick={handleDelete}
          className="invisible flex size-6 items-center justify-center rounded-md text-text-3 transition-colors hover:bg-red-soft hover:text-red group-hover:visible"
        >
          <Trash2 className="size-3.5" />
          <span className="sr-only">Delete notification</span>
        </button>
      </div>
    </div>
  );
};
