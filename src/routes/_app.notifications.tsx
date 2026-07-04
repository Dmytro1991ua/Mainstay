import { createFileRoute } from "@tanstack/react-router";

const NotificationsPage = () => {
  return <p className="text-sm text-text-2">Notifications — coming soon.</p>;
};

export const Route = createFileRoute("/_app/notifications")({
  component: NotificationsPage,
});
