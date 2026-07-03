import { createFileRoute } from "@tanstack/react-router";

const TasksPage = () => {
  return <p className="text-sm text-text-2">Tasks — coming soon.</p>;
};

export const Route = createFileRoute("/_app/tasks")({
  component: TasksPage,
});
