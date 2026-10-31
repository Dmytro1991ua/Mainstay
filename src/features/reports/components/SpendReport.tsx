import { AlertTriangle, BarChart3, RotateCcw } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { DatePicker } from "@/shared/ui/date-picker";
import { EmptyState } from "@/shared/ui/empty-state";
import { Select } from "@/shared/ui/select";
import { Skeleton } from "@/shared/ui/skeleton";

import { GROUP_BY_OPTIONS } from "../config";
import { useSpendQuery } from "../hooks/use-reports";
import { useSpendControls } from "../hooks/use-spend-controls";

import { SpendSummaryCards } from "./SpendSummaryCards";

import type { SpendGranularity } from "../api/reports.api";

export const SpendReport = () => {
  const { range, setRange, groupBy, setGroupBy, params } = useSpendControls();
  const { data, isPending, isError, refetch } = useSpendQuery(params);

  const renderContent = () => {
    if (isError) {
      return (
        <EmptyState
          icon={AlertTriangle}
          message="Couldn't load spend"
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {["c1", "c2", "c3"].map((key) => (
            <Skeleton key={key} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      );
    }

    if (data.summary.receivedOrders === 0) {
      return (
        <div className="rounded-xl border border-border bg-panel p-5 shadow-card">
          <EmptyState
            icon={BarChart3}
            message="No received orders in this range"
            description="Adjust the date range to see what was spent."
          />
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4">
        <SpendSummaryCards summary={data.summary} />
        {data.summary.unrecordedReceived > 0 && (
          <p className="text-xs text-text-3">
            {data.summary.unrecordedReceived} received{" "}
            {data.summary.unrecordedReceived === 1 ? "order has" : "orders have"} no price recorded
            and {data.summary.unrecordedReceived === 1 ? "isn't" : "aren't"} included in the totals.
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="w-64">
          <DatePicker
            mode="range"
            selected={range}
            onSelect={setRange}
            placeholder="Pick a date range"
          />
        </div>
        <div className="w-40">
          <Select
            options={GROUP_BY_OPTIONS}
            value={groupBy}
            onValueChange={(value) => setGroupBy(value as SpendGranularity)}
          />
        </div>
      </div>
      {renderContent()}
    </div>
  );
};
