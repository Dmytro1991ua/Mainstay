import { AlertTriangle, BarChart3, RotateCcw } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { DatePicker } from "@/shared/ui/date-picker";
import { EmptyState } from "@/shared/ui/empty-state";
import { Select } from "@/shared/ui/select";
import { Skeleton } from "@/shared/ui/skeleton";

import { GROUP_BY_OPTIONS } from "../config";
import { useThroughputQuery } from "../hooks/use-reports";
import { useThroughputControls } from "../hooks/use-throughput-controls";
import { formatCompletionRate, formatDays } from "../utils";

import { ThroughputChart } from "./ThroughputChart";

import type {
  ThroughputGranularity,
  ThroughputReport as ThroughputReportData,
} from "../api/reports.api";

const SummaryCards = ({ summary }: { summary: ThroughputReportData["summary"] }) => {
  const cards = [
    { label: "Created", value: summary.totalCreated },
    { label: "Completed", value: summary.totalCompleted },
    { label: "Completion rate", value: formatCompletionRate(summary.completionRate) },
    { label: "Avg cycle time", value: formatDays(summary.avgCompletionDays) },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-xl border border-border bg-panel p-4 shadow-card">
          <p className="text-[13px] font-medium text-text-3">{card.label}</p>
          <p className="mt-0.5 text-2xl font-semibold tabular-nums text-text">{card.value}</p>
        </div>
      ))}
    </div>
  );
};

export const ThroughputReport = () => {
  const { range, setRange, groupBy, setGroupBy, params } = useThroughputControls();
  const { data, isPending, isError, refetch } = useThroughputQuery(params);

  const renderContent = () => {
    if (isError) {
      return (
        <EmptyState
          icon={AlertTriangle}
          message="Couldn't load throughput"
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
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {["c1", "c2", "c3", "c4"].map((key) => (
              <Skeleton key={key} className="h-20 w-full rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-72 w-full rounded-xl" />
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4">
        <SummaryCards summary={data.summary} />
        <div className="rounded-xl border border-border bg-panel p-5 shadow-card">
          {data.series.length === 0 ? (
            <EmptyState
              icon={BarChart3}
              message="No tasks in this range"
              description="Adjust the date range or grouping to see throughput."
            />
          ) : (
            <ThroughputChart series={data.series} groupBy={groupBy} />
          )}
        </div>
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
            onValueChange={(value) => setGroupBy(value as ThroughputGranularity)}
          />
        </div>
      </div>
      {renderContent()}
    </div>
  );
};
