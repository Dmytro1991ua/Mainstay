import { useInfiniteQuery } from "@tanstack/react-query";

import { type InventoryListParams, listInventory } from "../api/inventory-api";

const PAGE_SIZE = 25;

/** Sort/search/filter inputs — everything except pagination, which the hook owns. */
export type InventoryTableParams = Omit<InventoryListParams, "page" | "limit">;

/**
 * Server-driven data source for the inventory table. The params ARE the query
 * key, so any sort/search/filter change re-fetches automatically — there is no
 * imperative refetch. Pagination is cursor-less page/limit via useInfiniteQuery;
 * pages are flattened into one row list for infinite scroll.
 */
export function useInventoryTable(params: InventoryTableParams) {
  const query = useInfiniteQuery({
    queryKey: ["inventory", params],
    queryFn: ({ pageParam }) => listInventory({ ...params, page: pageParam, limit: PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.page < lastPage.meta.pages ? lastPage.meta.page + 1 : undefined,
  });

  return {
    rows: query.data?.pages.flatMap((page) => page.data) ?? [],
    total: query.data?.pages[0]?.meta.total ?? 0,
    loading: query.isPending,
    error: query.isError ? (query.error as Error).message : undefined,
    hasMore: query.hasNextPage,
    loadMore: () => {
      void query.fetchNextPage();
    },
  };
}
