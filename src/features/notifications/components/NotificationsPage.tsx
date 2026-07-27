import { PageShell } from "@/shared/ui/page-shell";

import { useNotifications } from "../hooks/use-notifications";

import { NotificationsList } from "./NotificationsList";

export const NotificationsPage = () => {
  const unreadCount = useNotifications({ isRead: "false" }).notifications.length;

  return (
    <PageShell title="Notifications" subtitle={`${unreadCount} unread`} variant="plain">
      <NotificationsList />
    </PageShell>
  );
};
