import { useQuery } from "@tanstack/react-query";

import { useInfiniteQueryList, useMutation } from "@/shared/hooks/use-crud";

import {
  cancelReorder,
  createReorder,
  fetchReorders,
  fetchReorderStats,
  orderReorder,
  receiveReorder,
  type ReceiveReorderInput,
  type Reorder,
  type ReorderListParams,
} from "../api/reorders.api";

export const REORDERS_KEY = "reorders";

export const useReordersQuery = (params: ReorderListParams, options?: { enabled?: boolean }) =>
  useInfiniteQueryList<Reorder, ReorderListParams>(REORDERS_KEY, params, fetchReorders, options);

export const useReorderStatsQuery = () =>
  useQuery({
    queryKey: [REORDERS_KEY, "stats"],
    queryFn: fetchReorderStats,
  });

export const useCreateReorder = () => useMutation(REORDERS_KEY, createReorder);

export const useOrderReorder = () => useMutation(REORDERS_KEY, orderReorder);

export const useReceiveReorder = () =>
  useMutation(
    REORDERS_KEY,
    ({ id, data }: { id: string; data?: ReceiveReorderInput }) => receiveReorder(id, data),
    { alsoInvalidate: ["inventory"] },
  );

export const useCancelReorder = () => useMutation(REORDERS_KEY, cancelReorder);
