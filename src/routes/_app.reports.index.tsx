import { createFileRoute } from "@tanstack/react-router";

import { ReportsPage } from "@/features/reports";
import { validateTableSearch } from "@/shared/ui/data-table";
import type { OnSetTableState } from "@/shared/ui/data-table";

const ReportsRoute = () => {
  const navigate = Route.useNavigate();
  const tableState = Route.useSearch();

  const onSetTableState: OnSetTableState = (updater) => {
    navigate({ search: updater });
  };

  return <ReportsPage tableState={tableState} onSetTableState={onSetTableState} />;
};

export const Route = createFileRoute("/_app/reports/")({
  validateSearch: validateTableSearch,
  component: ReportsRoute,
});
