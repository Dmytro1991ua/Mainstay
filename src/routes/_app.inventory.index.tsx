import { createFileRoute } from "@tanstack/react-router";

import { InventoryPage } from "@/features/inventory";
import { validateTableSearch } from "@/shared/ui/data-table";
import type { OnSetTableState } from "@/shared/ui/data-table";

const InventoryRoute = () => {
  const navigate = Route.useNavigate();
  const tableState = Route.useSearch();

  const onSetTableState: OnSetTableState = (updater) => {
    navigate({ search: updater });
  };

  return <InventoryPage tableState={tableState} onSetTableState={onSetTableState} />;
};

export const Route = createFileRoute("/_app/inventory/")({
  validateSearch: validateTableSearch,
  component: InventoryRoute,
});
