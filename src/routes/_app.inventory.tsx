import { createFileRoute } from "@tanstack/react-router";

import { InventoryTable } from "@/features/inventory";
import { validateInventorySearch } from "@/features/inventory/types";

const InventoryPage = () => (
  <div className="flex flex-col gap-4">
    <div>
      <h1 className="text-lg font-semibold text-text">Inventory</h1>
      <p className="text-sm text-text-3">Parts and stock across all sites.</p>
    </div>
    <InventoryTable />
  </div>
);

export const Route = createFileRoute("/_app/inventory")({
  validateSearch: validateInventorySearch,
  component: InventoryPage,
});
