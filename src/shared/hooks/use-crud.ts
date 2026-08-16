import {
  useInfiniteQuery,
  useMutation as useRQMutation,
  useQueryClient,
} from "@tanstack/react-query";

export type PaginatedResponse<TItem = unknown> = {
  data: TItem[];
  meta: { page: number; pages: number; total: number; limit: number };
};

export const useInfiniteQueryList = <TItem, TParams extends { page?: number }>(
  queryKey: string,
  params: TParams,
  fetcher: (params: TParams & { page: number }) => Promise<PaginatedResponse<TItem>>,
) =>
  useInfiniteQuery({
    queryKey: [queryKey, params],
    queryFn: ({ pageParam }) => fetcher({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.page < lastPage.meta.pages ? lastPage.meta.page + 1 : undefined,
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
