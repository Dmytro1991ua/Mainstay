import { Activity, AlertTriangle, Power, PowerOff, RotateCcw } from "lucide-react";

import type { AssetStatus } from "@/features/assets/api/assets.api";
import { Button } from "@/shared/ui/button";
import { type ActionConfig, DetailActions } from "@/shared/ui/detail-actions";
import { EmptyState } from "@/shared/ui/empty-state";
import { Skeleton } from "@/shared/ui/skeleton";

import { useDowntime } from "../hooks/use-downtime";
import { useEndDowntimeForm } from "../hooks/use-end-downtime-form";
import { useStartDowntimeForm } from "../hooks/use-start-downtime-form";

import { DowntimeEventItem } from "./DowntimeEventItem";
import { DowntimeSummaryTiles } from "./DowntimeSummaryTiles";
import { EndDowntimeDialog } from "./EndDowntimeDialog";
import { StartDowntimeDialog } from "./StartDowntimeDialog";

type AssetDowntimeProps = { assetId: string; assetStatus: AssetStatus };

const SKELETON_KEYS = ["s1", "s2", "s3"];

export const AssetDowntime = ({ assetId, assetStatus }: AssetDowntimeProps) => {
  const { data, isPending, isError, refetch } = useDowntime(assetId);
  const start = useStartDowntimeForm(assetId);
  const end = useEndDowntimeForm(assetId);

  const ongoingEvent = data?.events.find((event) => event.endedAt === null);
  // The server refuses a second downtime while one is open, and any on a retired asset.
  const canRecord = data !== undefined && !ongoingEvent && assetStatus === "OPERATIONAL";

  const actions: ActionConfig[] = [
    {
      label: "Back in service",
      icon: Power,
      onClick: () => ongoingEvent && end.open(ongoingEvent),
      show: ongoingEvent !== undefined,
    },
    { label: "Record downtime", icon: PowerOff, onClick: start.open, show: canRecord },
  ];

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
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-baseline gap-2">
          <h2 className="text-sm font-semibold text-text">Downtime</h2>
          <span className="text-xs text-text-3">Last 365 days</span>
        </div>
        <DetailActions actions={actions} />
      </div>
      {renderContent()}
      <StartDowntimeDialog
        open={start.isOpen}
        form={start.form}
        onSave={start.save}
        onClose={start.close}
        isSaving={start.isSaving}
      />
      <EndDowntimeDialog
        target={end.target}
        form={end.form}
        onSave={end.save}
        onClose={end.close}
        isSaving={end.isSaving}
      />
    </section>
  );
};
