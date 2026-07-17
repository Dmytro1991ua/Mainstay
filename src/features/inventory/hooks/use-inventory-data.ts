import { useDebounce } from "@/shared/hooks/use-debounce";
import { useAuthStore } from "@/shared/stores/auth-store";
import type { FilterConfig, TableUrlState } from "@/shared/ui/data-table";

import { INVENTORY_FILTER_CONFIG } from "../config";
import { buildInventoryParams, formatCategoryLabel } from "../utils";

import { useInventoryCategoriesQuery, useInventoryQuery } from "./use-inventory";

export const useInventoryData = (tableState: TableUrlState) => {
  const user = useAuthStore((s) => s.user);
  const canManage = user?.roles.some((r) => r === "ADMIN" || r === "MANAGER") ?? false;
  const canDelete = user?.roles.includes("ADMIN") ?? false;

  const debouncedSearch = useDebounce(tableState.search, 300);
  const { data, isLoading, isError, refetch, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInventoryQuery(buildInventoryParams(tableState, debouncedSearch));

  const { data: categories } = useInventoryCategoriesQuery();

  const filterConfig: FilterConfig[] = [
    ...INVENTORY_FILTER_CONFIG,
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

  const items = data?.pages.flatMap((p) => p.data) ?? [];

  return {
    items,
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
