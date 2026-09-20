import { useDebounce } from "@/shared/hooks/use-debounce";
import type { TableUrlState } from "@/shared/ui/data-table";

import { buildTechnicianParams } from "../utils";

import { useTechnicianWorkloadQuery } from "./use-reports";

export const useTechnicianWorkloadData = (tableState: TableUrlState) => {
  const debouncedSearch = useDebounce(tableState.search, 300);

  const { data, isLoading, isError, refetch, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useTechnicianWorkloadQuery(buildTechnicianParams(tableState, debouncedSearch));

  const technicians = data?.pages.flatMap((p) => p.data) ?? [];

  return {
    technicians,
    isLoading,
    isError,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  };
};
