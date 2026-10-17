import { AlertTriangle, Gauge, RotateCcw } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/ui/empty-state";
import { Skeleton } from "@/shared/ui/skeleton";
import { formatReading, formatTimeAgo } from "@/shared/utils";

import { useMetersQuery } from "../hooks/use-meters";

const SKELETON_KEYS = ["m1", "m2"];

type AssetMetersProps = { assetId: string };

export const AssetMeters = ({ assetId }: AssetMetersProps) => {
  const { data, isPending, isError, refetch, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useMetersQuery({ assetId, limit: 50, sortBy: "name", sortOrder: "asc" });

  const meters = data?.pages.flatMap((p) => p.data) ?? [];
  const total = data?.pages[0]?.meta.total ?? 0;

  const renderContent = () => {
    if (isError) {
      return (
        <EmptyState
          icon={AlertTriangle}
          message="Couldn't load meters"
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
        <div className="flex flex-col gap-2">
          {SKELETON_KEYS.map((key) => (
            <Skeleton key={key} className="h-11 w-full rounded-lg" />
          ))}
        </div>
      );
    }

    if (meters.length === 0) {
      return (
        <EmptyState
          icon={Gauge}
          message="No meters"
          description="Track engine hours, mileage or cycles to schedule maintenance by usage."
        />
      );
    }

    return (
      <>
        <ul className="flex flex-col gap-1">
          {meters.map((meter) => (
            <li
              key={meter.id}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-panel-2"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-text">{meter.name}</p>
                <p className="text-xs text-text-3">
                  Last reading {formatTimeAgo(meter.lastReadingAt)}
                </p>
              </div>
              <span className="shrink-0 text-sm font-medium tabular-nums text-text">
                {formatReading(meter.currentReading, meter.unit)}
              </span>
            </li>
          ))}
        </ul>
        {hasNextPage && (
          <div className="mt-3 flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? "Loading…" : `Load more (${meters.length} of ${total})`}
            </Button>
          </div>
        )}
      </>
    );
  };

  return (
    <section className="rounded-xl border border-border bg-panel p-5 shadow-card">
      <h2 className="mb-3 text-sm font-semibold text-text">Meters{data ? ` (${total})` : ""}</h2>
      {renderContent()}
    </section>
  );
};
