import { useDebounce } from "@/shared/hooks/use-debounce";
import type { TableUrlState } from "@/shared/ui/data-table";

import { WORK_ORDER_FILTER_CONFIG } from "../config";
import { buildWorkOrderParams } from "../utils";

import { useWorkOrderRequestsQuery } from "./use-work-order-requests";

export const useWorkOrderRequestsData = (tableState: TableUrlState) => {
  const debouncedSearch = useDebounce(tableState.search, 300);

  const { data, isLoading, isError, refetch, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useWorkOrderRequestsQuery(buildWorkOrderParams(tableState, debouncedSearch));

  const requests = data?.pages.flatMap((p) => p.data) ?? [];

  return {
    requests,
    isLoading,
    isError,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    filterConfig: WORK_ORDER_FILTER_CONFIG,
  };
};
