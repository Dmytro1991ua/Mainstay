import { createFileRoute } from "@tanstack/react-router";

import { WorkOrderRequestDetailPage } from "@/features/work-order-requests";

const WorkOrderRequestDetailRoute = () => {
  const { requestId } = Route.useParams();

  return <WorkOrderRequestDetailPage requestId={requestId} />;
};

export const Route = createFileRoute("/_app/work-order-requests/$requestId")({
  component: WorkOrderRequestDetailRoute,
});
