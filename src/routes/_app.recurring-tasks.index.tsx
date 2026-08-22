import { createFileRoute } from "@tanstack/react-router";

import { RecurringTasksPage } from "@/features/recurring-tasks";

export const Route = createFileRoute("/_app/recurring-tasks/")({
  component: RecurringTasksPage,
});
