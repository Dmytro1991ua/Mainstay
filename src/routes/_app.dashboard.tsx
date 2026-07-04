import { createFileRoute } from "@tanstack/react-router";

const DashboardPage = () => {
  return <p className="text-sm text-text-2">Dashboard — coming soon.</p>;
};

export const Route = createFileRoute("/_app/dashboard")({
  component: DashboardPage,
});
