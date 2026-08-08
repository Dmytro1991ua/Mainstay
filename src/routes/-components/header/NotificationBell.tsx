import { Link } from "@tanstack/react-router";
import { Bell } from "lucide-react";

import { useUnreadCount } from "@/features/notifications/hooks/use-unread-count";
import { cn } from "@/shared/lib/utils";

export const NotificationBell = () => {
  const { count, hasUnread } = useUnreadCount();

  return (
    <Link
      to="/notifications"
      className="relative flex size-8 items-center justify-center rounded-lg text-text-2 transition-colors hover:bg-panel-2 hover:text-text"
    >
      <Bell
        className={cn("size-4.5", hasUnread && "animate-bell-ring origin-top")}
        strokeWidth={1.75}
      />
      {hasUnread && (
        <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold leading-none text-white">
          {count > 9 ? "9+" : count}
        </span>
      )}
      <span className="sr-only">Notifications, {count} unread</span>
    </Link>
  );
};
