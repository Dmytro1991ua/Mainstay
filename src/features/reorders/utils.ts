import type { RowHighlightInfo, TableUrlState } from "@/shared/ui/data-table";

import { REORDER_ROW_HIGHLIGHT } from "./config";

import type { Reorder, ReorderListParams, ReorderSortBy } from "./api/reorders.api";

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

export const getReorderRowHighlight = (row: Reorder): RowHighlightInfo => {
  const highlightStyles = REORDER_ROW_HIGHLIGHT[row.status] ?? "";

  return { isHighlighted: !!highlightStyles, highlightStyles };
};
