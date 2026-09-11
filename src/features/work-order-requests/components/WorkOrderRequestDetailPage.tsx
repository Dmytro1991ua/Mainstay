import { AlertTriangle, RotateCcw } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { DetailShell } from "@/shared/ui/detail-shell";
import { EmptyState } from "@/shared/ui/empty-state";

import { useWorkOrderRequestQuery } from "../hooks/use-work-order-requests";
import { getWorkOrderRequestDetailFields } from "../work-order-request-detail.config";

const SKELETON_KEYS = ["Status", "Priority", "Category", "Requested by", "Asset", "Requested"];

type WorkOrderRequestDetailPageProps = { requestId: string };

export const WorkOrderRequestDetailPage = ({ requestId }: WorkOrderRequestDetailPageProps) => {
  const { data: request, isPending, isError, refetch } = useWorkOrderRequestQuery(requestId);

  if (isPending) {
    return (
      <DetailShell
        backTo="/work-order-requests"
        title=""
        fields={[]}
        isPending
        skeletonKeys={SKELETON_KEYS}
      />
    );
  }

  if (isError || !request) {
    return (
      <div className="flex flex-1 flex-col gap-4 min-h-0">
        <DetailShell backTo="/work-order-requests" title="Request not found" fields={[]} />
        <div className="flex flex-1 items-center justify-center rounded-xl border border-border bg-panel p-6 shadow-card">
          <EmptyState
            icon={AlertTriangle}
            message="Request not found"
            description="This request may have been removed or doesn't exist."
            variant="red"
            action={
              <Button onClick={() => refetch()}>
                <RotateCcw className="size-3.5" />
                Retry
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <DetailShell
      backTo="/work-order-requests"
      title={request.title}
      fields={getWorkOrderRequestDetailFields(request)}
      skeletonKeys={SKELETON_KEYS}
    />
  );
};
