import type { TableUrlState } from "@/shared/ui/data-table";

import type { ReorderListParams, ReorderSortBy } from "./api/reorders.api";

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
