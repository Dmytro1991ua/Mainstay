import { createFileRoute } from "@tanstack/react-router";

import { TasksPage } from "@/features/tasks";
import { validateTableSearch } from "@/shared/ui/data-table";
import type { OnSetTableState } from "@/shared/ui/data-table";

const TasksRoute = () => {
  const navigate = Route.useNavigate();
  const tableState = Route.useSearch();

  const onSetTableState: OnSetTableState = (updater) => {
    navigate({ search: updater });
  };

  return <TasksPage tableState={tableState} onSetTableState={onSetTableState} />;
};

export const Route = createFileRoute("/_app/tasks/")({
  validateSearch: validateTableSearch,
  component: TasksRoute,
});
