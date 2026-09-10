import type { TableUrlState } from "@/shared/ui/data-table";

import type {
  WorkOrderRequestListParams,
  WorkOrderRequestSortBy,
} from "./api/work-order-requests.api";

export const buildWorkOrderParams = (
  tableState: TableUrlState,
  search: string | undefined,
): WorkOrderRequestListParams => {
  const [activeSort] = tableState.sorting ?? [];
  // Default to newest-first (createdAt desc) until the user picks a sort.
  const sortOrder = !activeSort || activeSort.desc ? "desc" : "asc";

  return {
    search: search || undefined,
    status: tableState.filters?.status?.[0] as WorkOrderRequestListParams["status"],
    sortBy: (activeSort?.id as WorkOrderRequestSortBy) ?? "createdAt",
    sortOrder,
    limit: 25,
  };
};
