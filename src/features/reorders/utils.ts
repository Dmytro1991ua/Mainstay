import type { RowHighlightInfo, TableUrlState } from "@/shared/ui/data-table";
import { formatMoney } from "@/shared/utils";

import { REORDER_ESTIMATE_COMPARISON_CONFIG, REORDER_ROW_HIGHLIGHT } from "./config";

import type { Reorder, ReorderListParams, ReorderSortBy } from "./api/reorders.api";
import type { ReorderEstimateComparison, ReorderEstimateDifference } from "./types";

export const buildReorderParams = (tableState: TableUrlState): ReorderListParams => {
  const [activeSort] = tableState.sorting ?? [];

  const sortOrder = !activeSort || activeSort.desc ? "desc" : "asc";

  return {
    status: tableState.filters?.status?.[0] as ReorderListParams["status"],
    sortBy: (activeSort?.id as ReorderSortBy) ?? "createdAt",
    sortOrder,
    limit: 25,
  };
};

// `variance` is the API's name for actual total − estimate total, as a signed 2-dp money string
// (e.g. "30.00" = paid $30 more than estimated, "-12.50" = paid $12.50 less).
const getEstimateComparison = (variance: string): ReorderEstimateComparison => {
  const amount = Number(variance);

  if (amount > 0) return "overEstimate";
  if (amount < 0) return "underEstimate";

  return "asEstimated";
};

/** Text and color for the difference from the estimate: "+$30.00" red, "-$12.50" green, "$0.00" neutral. */
export const getReorderEstimateDifference = (variance: string): ReorderEstimateDifference => {
  const { className, sign } = REORDER_ESTIMATE_COMPARISON_CONFIG[getEstimateComparison(variance)];

  return { text: `${sign}${formatMoney(variance)}`, className };
};

export const getReorderRowHighlight = (row: Reorder): RowHighlightInfo => {
  const highlightStyles = REORDER_ROW_HIGHLIGHT[row.status] ?? "";

  return { isHighlighted: !!highlightStyles, highlightStyles };
};
