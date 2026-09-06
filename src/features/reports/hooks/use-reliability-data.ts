import { ASSET_STATUS_OPTIONS } from "@/features/assets/config";
import { useAssetCategoriesQuery } from "@/features/assets/hooks/use-assets";
import { useDebounce } from "@/shared/hooks/use-debounce";
import type { FilterConfig, TableUrlState } from "@/shared/ui/data-table";
import { formatEnumLabel } from "@/shared/utils";

import { buildReliabilityParams } from "../utils";

import { useReliabilityQuery } from "./use-reports";

export const useReliabilityData = (tableState: TableUrlState) => {
  const debouncedSearch = useDebounce(tableState.search, 300);

  const { data, isLoading, isError, refetch, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useReliabilityQuery(buildReliabilityParams(tableState, debouncedSearch));

  const { data: categories } = useAssetCategoriesQuery();

  const filterConfig: FilterConfig[] = [
    { id: "status", label: "Status", type: "single", options: ASSET_STATUS_OPTIONS },
    ...(categories
      ? [
          {
            id: "category",
            label: "Category",
            type: "single" as const,
            options: categories.map((c) => ({ value: c, label: formatEnumLabel(c) })),
          },
        ]
      : []),
  ];

  const rows = data?.pages.flatMap((p) => p.data) ?? [];

  return {
    rows,
    isLoading,
    isError,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    filterConfig,
  };
};
