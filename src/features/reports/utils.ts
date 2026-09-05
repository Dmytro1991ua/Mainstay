import { format, subWeeks } from "date-fns";

import type { DateRange } from "@/shared/ui/date-picker";

import type { ThroughputGranularity } from "./api/reports.api";

const DEFAULT_RANGE_WEEKS = 12;

export const getDefaultRange = (): DateRange => ({
  from: subWeeks(new Date(), DEFAULT_RANGE_WEEKS),
  to: new Date(),
});

export const formatBucketLabel = (bucket: string, groupBy: ThroughputGranularity): string => {
  const date = new Date(bucket);

  return groupBy === "month" ? format(date, "MMM yyyy") : format(date, "MMM d");
};

export const formatCompletionRate = (rate: number | null): string =>
  rate == null ? "—" : `${Math.round(rate * 100)}%`;

export const formatDays = (days: number | null): string =>
  days == null ? "—" : `${days.toFixed(1)}d`;
