import type { TableUrlState } from "@/shared/ui/data-table";

import { REORDER_FILTER_CONFIG } from "../config";
import { buildReorderParams } from "../utils";

import { useReordersQuery } from "./use-reorders";

export const useReordersData = (tableState: TableUrlState) => {
  const { data, isLoading, isError, refetch, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useReordersQuery(buildReorderParams(tableState));

  const reorders = data?.pages.flatMap((p) => p.data) ?? [];

  return {
    reorders,
    isLoading,
    isError,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    filterConfig: REORDER_FILTER_CONFIG,
  };
};
