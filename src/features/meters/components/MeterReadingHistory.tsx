import { format } from "date-fns";

import { flattenPages, getTotal } from "@/shared/hooks/use-crud";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { formatReading } from "@/shared/utils";

import { useMeterReadings } from "../hooks/use-meters";

import type { Meter } from "../api/meters.api";

const SKELETON_KEYS = ["r1", "r2", "r3"];

type MeterReadingHistoryProps = { meter: Meter };

export const MeterReadingHistory = ({ meter }: MeterReadingHistoryProps) => {
  const { data, isPending, isError, refetch, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useMeterReadings(meter.id);

  const readings = flattenPages(data);
  const total = getTotal(data);

  const renderContent = () => {
    if (isError) {
      return (
        <p className="py-1.5 text-xs text-text-3">
          Couldn&apos;t load readings.{" "}
          <button
            type="button"
            onClick={() => refetch()}
            className="font-medium text-accent hover:underline"
          >
            Retry
          </button>
        </p>
      );
    }

    if (isPending) {
      return (
        <div className="flex flex-col gap-2 py-1.5">
          {SKELETON_KEYS.map((key) => (
            <Skeleton key={key} className="h-4 w-full" />
          ))}
        </div>
      );
    }

    if (readings.length === 0) {
      return <p className="py-1.5 text-xs text-text-3">No readings yet.</p>;
    }

    return (
      <>
        <ul>
          {readings.map((reading) => (
            <li key={reading.id} className="flex items-center justify-between gap-3 py-1.5 text-xs">
              <span className="text-text-3">
                {format(new Date(reading.recordedAt), "MMM d, yyyy, h:mm a")}
              </span>
              <span className="min-w-0 flex-1 truncate text-text-3">
                {reading.recorder?.userName ?? "Unknown user"}
              </span>
              <span className="shrink-0 font-medium tabular-nums text-text">
                {formatReading(reading.value, meter.unit)}
              </span>
            </li>
          ))}
        </ul>
        {hasNextPage && (
          <div className="mt-2">
            <Button
              variant="outline"
              size="xs"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? "Loading…" : `Load more (${readings.length} of ${total})`}
            </Button>
          </div>
        )}
      </>
    );
  };

  return <div className="mb-2 ml-5 border-l border-border pl-4">{renderContent()}</div>;
};
