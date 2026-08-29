import { useDebounce } from "@/shared/hooks/use-debounce";
import { useAuthStore } from "@/shared/stores/auth-store";
import type { FilterConfig, TableUrlState } from "@/shared/ui/data-table";

import { ASSET_FILTER_CONFIG } from "../config";
import { buildAssetParams, formatCategoryLabel } from "../utils";

import { useAssetCategoriesQuery, useAssetsQuery } from "./use-assets";

export const useAssetsData = (tableState: TableUrlState) => {
  const user = useAuthStore((s) => s.user);
  const canManage = user?.roles.some((r) => r === "ADMIN" || r === "MANAGER") ?? false;
  const canDelete = user?.roles.includes("ADMIN") ?? false;

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
