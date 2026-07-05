import { Bell } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { EmptyState } from "@/shared/ui/empty-state";
import { formatTimeAgo } from "@/shared/utils/formatters";

import { NOTIFICATION_TYPE_CONFIG } from "./configs";

import type { Notification } from "../api/dashboard-api";

export const RecentNotifications = ({ notifications }: { notifications: Notification[] }) => {
  if (notifications.length === 0) {
    return (
      <EmptyState
        icon={Bell}
        message="No unread alerts."
        description="You're all caught up."
        variant="green"
      />
    );
  }

  return (
    <div className={cn("divide-y divide-border")}>
      {notifications.map((n) => {
        const { icon: Icon, iconClass, bgClass } = NOTIFICATION_TYPE_CONFIG[n.type];
        return (
          <div key={n.id} className={cn("flex items-start gap-3 py-2.5")}>
            <span
              className={cn(
                "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                bgClass,
              )}
            >
              <Icon className={cn("h-3.5 w-3.5", iconClass)} strokeWidth={1.75} />
            </span>
            <div className={cn("min-w-0 flex-1")}>
              <p className={cn("text-[12px] leading-snug text-text")}>{n.message}</p>
              <p className={cn("mt-0.5 text-[11px] text-text-3")}>{formatTimeAgo(n.createdAt)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
