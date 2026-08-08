import { PageShell } from "@/shared/ui/page-shell";

import { NotificationsList } from "./NotificationsList";

export const NotificationsPage = () => {
  return (
    <PageShell title="Notifications" variant="plain">
      <NotificationsList />
    </PageShell>
  );
};
