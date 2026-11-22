import { Activity, AlertTriangle, RotateCcw } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/ui/empty-state";
import { Skeleton } from "@/shared/ui/skeleton";

import { useDowntime } from "../hooks/use-downtime";

import { DowntimeEventItem } from "./DowntimeEventItem";
import { DowntimeSummaryTiles } from "./DowntimeSummaryTiles";

const SKELETON_KEYS = ["s1", "s2", "s3"];

export const AssetDowntime = ({ assetId }: { assetId: string }) => {
  const { data, isPending, isError, refetch } = useDowntime(assetId);

  const renderContent = () => {
    if (isError) {
      return (
        <EmptyState
          icon={AlertTriangle}
          message="Couldn't load downtime"
          description="The server didn't respond."
          variant="red"
          action={
            <Button onClick={() => refetch()}>
              <RotateCcw className="size-3.5" />
              Retry
            </Button>
          }
        />
      );
    }

    if (isPending) {
      return (
        <div className="flex flex-col gap-3">
          {SKELETON_KEYS.map((key) => (
            <Skeleton key={key} className="h-10 w-full" />
          ))}
        </div>
      );
    }

    return (
      <>
        <DowntimeSummaryTiles summary={data.summary} />
        {data.events.length === 0 ? (
          <EmptyState
            icon={Activity}
            message="No downtime recorded"
            description="Breakdowns and planned downtime will appear here."
          />
        ) : (
          <ul className="mt-2 divide-y divide-border">
            {data.events.map((event) => (
              <DowntimeEventItem key={event.id} event={event} />
            ))}
          </ul>
        )}
      </>
    );
  };

  return (
    <section className="rounded-xl border border-border bg-panel p-5 shadow-card">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-sm font-semibold text-text">Downtime</h2>
        <span className="text-xs text-text-3">Last 365 days</span>
      </div>
      {renderContent()}
    </section>
  );
};
