import { createFileRoute } from "@tanstack/react-router";

import { InventoryDetailPage } from "@/features/inventory";

const InventoryDetailRoute = () => {
  const { itemId } = Route.useParams();

  return <InventoryDetailPage itemId={itemId} />;
};

export const Route = createFileRoute("/_app/inventory/$itemId")({
  component: InventoryDetailRoute,
});
