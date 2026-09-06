import { format, parseISO, subWeeks } from "date-fns";

import type { TableUrlState } from "@/shared/ui/data-table";
import type { DateRange } from "@/shared/ui/date-picker";

import type {
  ReliabilityListParams,
  ReliabilitySortBy,
  ThroughputGranularity,
} from "./api/reports.api";

const DEFAULT_RANGE_WEEKS = 12;

export const getDefaultRange = (): DateRange => ({
  from: subWeeks(new Date(), DEFAULT_RANGE_WEEKS),
  to: new Date(),
});

export const formatBucketLabel = (bucket: string, groupBy: ThroughputGranularity): string => {
  // Buckets are UTC boundaries (…T00:00:00.000Z). Parse the date part as a local
  // date so format() doesn't shift the label back a day/month west of UTC.
  const date = parseISO(bucket.slice(0, 10));

  return groupBy === "month" ? format(date, "MMM yyyy") : format(date, "MMM d");
};

export const formatCompletionRate = (rate: number | null): string =>
  rate == null ? "—" : `${Math.round(rate * 100)}%`;

export const formatDays = (days: number | null): string =>
  days == null ? "—" : `${days.toFixed(1)}d`;

export const buildReliabilityParams = (
  tableState: TableUrlState,
  search: string | undefined,
): ReliabilityListParams => {
  const [activeSort] = tableState.sorting ?? [];
  // Default to most-worked-first (desc) when the user hasn't chosen a sort.
  const sortOrder = !activeSort || activeSort.desc ? "desc" : "asc";

  return {
    search: search || undefined,
    status: tableState.filters?.status?.[0],
    category: tableState.filters?.category?.[0],
    sortBy: (activeSort?.id as ReliabilitySortBy) ?? "totalTasks",
    sortOrder,
    limit: 25,
  };
};
