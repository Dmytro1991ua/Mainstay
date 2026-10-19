import {
  useInfiniteQuery,
  useMutation as useRQMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";

export type PaginatedResponse<TItem = unknown> = {
  data: TItem[];
  meta: { page: number; pages: number; total: number; limit: number };
};

type InfinitePages<TItem> = InfiniteData<PaginatedResponse<TItem>> | undefined;

/** An infinite query holds a list of pages; this joins them into one flat list of items. */
export const flattenPages = <TItem>(data: InfinitePages<TItem>): TItem[] =>
  data?.pages.flatMap((page) => page.data) ?? [];

/** The total item count reported by the server, read from the first page. */
export const getTotal = <TItem>(data: InfinitePages<TItem>): number =>
  data?.pages[0]?.meta.total ?? 0;

export const useInfiniteQueryList = <TItem, TParams extends { page?: number }>(
  queryKey: string,
  params: TParams,
  fetcher: (params: TParams & { page: number }) => Promise<PaginatedResponse<TItem>>,
  options?: { enabled?: boolean },
) =>
  useInfiniteQuery({
    queryKey: [queryKey, params],
    queryFn: ({ pageParam }) => fetcher({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.page < lastPage.meta.pages ? lastPage.meta.page + 1 : undefined,
    enabled: options?.enabled,
  });

export const useMutation = <TData, TVariables>(
  queryKey: string,
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: { alsoInvalidate?: string[] },
) => {
  const queryClient = useQueryClient();

  return useRQMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      options?.alsoInvalidate?.forEach((key) => queryClient.invalidateQueries({ queryKey: [key] }));
    },
  });
};
