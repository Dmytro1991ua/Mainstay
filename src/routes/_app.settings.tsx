import { createFileRoute } from "@tanstack/react-router";

const SettingsPage = () => {
  return <p className="text-sm text-text-2">Settings — coming soon.</p>;
};

export const Route = createFileRoute("/_app/settings")({
  component: SettingsPage,
});
