import { useDebounce } from "@/shared/hooks/use-debounce";
import type { FilterConfig, TableUrlState } from "@/shared/ui/data-table";

import { ASSET_FILTER_CONFIG } from "../config";
import { buildAssetParams, formatCategoryLabel } from "../utils";

import { useAssetPermissions } from "./use-asset-permissions";
import { useAssetCategoriesQuery, useAssetsQuery } from "./use-assets";

export const useAssetsData = (tableState: TableUrlState) => {
  const { canManage, canDelete } = useAssetPermissions();

  const debouncedSearch = useDebounce(tableState.search, 300);
  const { data, isLoading, isError, refetch, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useAssetsQuery(buildAssetParams(tableState, debouncedSearch));

  const { data: categories } = useAssetCategoriesQuery();

  const filterConfig: FilterConfig[] = [
    ...ASSET_FILTER_CONFIG,
    ...(categories
      ? [
          {
            id: "category",
            label: "Category",
            type: "single" as const,
            options: categories.map((c) => ({ value: c, label: formatCategoryLabel(c) })),
          },
        ]
      : []),
  ];

  const assets = data?.pages.flatMap((p) => p.data) ?? [];

  return {
    assets,
    isLoading,
    isError,
    refetch,
    canManage,
    canDelete,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    filterConfig,
  };
};
