import { createFileRoute } from "@tanstack/react-router";

const InventoryPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-text">Inventory</h1>
    </div>
  );
};

export const Route = createFileRoute("/_app/inventory")({
  component: InventoryPage,
});
