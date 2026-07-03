import { createFileRoute } from "@tanstack/react-router";

const InventoryPage = () => {
  return <p className="text-sm text-text-2">Inventory — coming soon.</p>;
};

export const Route = createFileRoute("/_app/inventory")({
  component: InventoryPage,
});
