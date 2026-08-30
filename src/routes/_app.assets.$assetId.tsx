import { createFileRoute } from "@tanstack/react-router";

import { AssetDetailPage } from "@/features/assets";

const AssetDetailRoute = () => {
  const { assetId } = Route.useParams();

  return <AssetDetailPage assetId={assetId} />;
};

export const Route = createFileRoute("/_app/assets/$assetId")({
  component: AssetDetailRoute,
});
