import { createFileRoute } from "@tanstack/react-router";

import { WorkOrderRequestsPage } from "@/features/work-order-requests";
import { validateTableSearch } from "@/shared/ui/data-table";
import type { OnSetTableState } from "@/shared/ui/data-table";

const WorkOrderRequestsRoute = () => {
  const navigate = Route.useNavigate();
  const tableState = Route.useSearch();

  const onSetTableState: OnSetTableState = (updater) => {
    navigate({ search: updater });
  };

  return <WorkOrderRequestsPage tableState={tableState} onSetTableState={onSetTableState} />;
};

export const Route = createFileRoute("/_app/work-order-requests/")({
  validateSearch: validateTableSearch,
  component: WorkOrderRequestsRoute,
});
