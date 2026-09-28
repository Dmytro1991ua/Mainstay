import { createFileRoute } from "@tanstack/react-router";

import { ReordersPage } from "@/features/reorders";
import { validateTableSearch } from "@/shared/ui/data-table";
import type { OnSetTableState } from "@/shared/ui/data-table";

const ReordersRoute = () => {
  const navigate = Route.useNavigate();
  const tableState = Route.useSearch();

  const onSetTableState: OnSetTableState = (updater) => {
    navigate({ search: updater });
  };

  return <ReordersPage tableState={tableState} onSetTableState={onSetTableState} />;
};

export const Route = createFileRoute("/_app/reorders/")({
  validateSearch: validateTableSearch,
  component: ReordersRoute,
});
