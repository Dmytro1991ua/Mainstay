import { createFileRoute } from "@tanstack/react-router";

import { AssetsPage } from "@/features/assets";
import { validateTableSearch } from "@/shared/ui/data-table";
import type { OnSetTableState } from "@/shared/ui/data-table";

const AssetsRoute = () => {
  const navigate = Route.useNavigate();
  const tableState = Route.useSearch();

  const onSetTableState: OnSetTableState = (updater) => {
    navigate({ search: updater });
  };

  return <AssetsPage tableState={tableState} onSetTableState={onSetTableState} />;
};

export const Route = createFileRoute("/_app/assets/")({
  validateSearch: validateTableSearch,
  component: AssetsRoute,
});
