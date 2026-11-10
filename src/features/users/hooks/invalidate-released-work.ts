import { RECURRING_TASKS_KEY } from "@/features/recurring-tasks/hooks/use-recurring-tasks";
import { REPORTS_KEY } from "@/features/reports/hooks/use-reports";
import { ASSET_TASKS_KEY, TASKS_KEY } from "@/features/tasks/hooks/use-tasks";

import type { QueryClient } from "@tanstack/react-query";

const DASHBOARD_KEY = "dashboard";
// Per-technician open and in-progress counts.
const TECHNICIAN_WORKLOAD_KEY = `${REPORTS_KEY}-technicians`;

/**
 * Deactivating a user releases their open tasks and default-assignee schedules on the server, so
 * everything that shows those assignments has to refetch.
 */
export const invalidateReleasedWork = (queryClient: QueryClient) => {
  [TASKS_KEY, ASSET_TASKS_KEY, RECURRING_TASKS_KEY, DASHBOARD_KEY, TECHNICIAN_WORKLOAD_KEY].forEach(
    (key) => queryClient.invalidateQueries({ queryKey: [key] }),
  );
};
