import { format, parseISO, subMonths, subWeeks } from "date-fns";

import type { TableUrlState } from "@/shared/ui/data-table";
import type { DateRange } from "@/shared/ui/date-picker";
import { formatMoney } from "@/shared/utils";

import type {
  ReliabilityListParams,
  ReliabilitySortBy,
  TechnicianListParams,
  TechnicianSortBy,
  ThroughputGranularity,
} from "./api/reports.api";

const DEFAULT_RANGE_WEEKS = 12;
const DEFAULT_SPEND_RANGE_MONTHS = 12;

export const getDefaultRange = (): DateRange => ({
  from: subWeeks(new Date(), DEFAULT_RANGE_WEEKS),
  to: new Date(),
});

export const getDefaultSpendRange = (): DateRange => ({
  from: subMonths(new Date(), DEFAULT_SPEND_RANGE_MONTHS),
  to: new Date(),
});

/** "+$120.00" when actual spend ran over the estimate, "-$50.00" when under, "$0.00" when equal. */
export const formatVariance = (variance: string): string => {
  const amount = Number(variance);
  if (!Number.isFinite(amount)) return "—";
  if (amount === 0) return formatMoney(0);

  return `${amount > 0 ? "+" : "-"}${formatMoney(Math.abs(amount))}`;
};

/**
 * A picked day as a plain date ("2026-10-29"). The server reads a plain `to` as "through the end of
 * that day"; a UTC timestamp from toISOString() would shift by the user's offset and cut the day off.
 */
export const toApiDate = (date: Date): string => format(date, "yyyy-MM-dd");

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

export const buildTechnicianParams = (
  tableState: TableUrlState,
  search: string | undefined,
): TechnicianListParams => {
  const [activeSort] = tableState.sorting ?? [];
  // Default to busiest-first (openTasks desc) when the user hasn't chosen a sort.
  const sortOrder = !activeSort || activeSort.desc ? "desc" : "asc";

  return {
    search: search || undefined,
    sortBy: (activeSort?.id as TechnicianSortBy) ?? "openTasks",
    sortOrder,
    limit: 25,
  };
};
