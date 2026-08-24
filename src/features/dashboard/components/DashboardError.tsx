import { AlertTriangle, RotateCcw } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/ui/empty-state";

export const DashboardError = ({ onRetry }: { onRetry: () => void }) => (
  <EmptyState
    icon={AlertTriangle}
    message="Couldn't load dashboard"
    description="The server didn't respond. Please try again."
    variant="red"
    action={
      <Button onClick={onRetry}>
        <RotateCcw className="size-3.5" />
        Retry
      </Button>
    }
  />
);
