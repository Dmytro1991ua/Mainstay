import { useInfiniteQueryList, useMutation } from "@/shared/hooks/use-crud";

import {
  cancelReorder,
  createReorder,
  fetchReorders,
  orderReorder,
  receiveReorder,
  type Reorder,
  type ReorderListParams,
} from "../api/reorders.api";

export const REORDERS_KEY = "reorders";

export const useReordersQuery = (params: ReorderListParams, options?: { enabled?: boolean }) =>
  useInfiniteQueryList<Reorder, ReorderListParams>(REORDERS_KEY, params, fetchReorders, options);

export const useCreateReorder = () => useMutation(REORDERS_KEY, createReorder);

export const useOrderReorder = () => useMutation(REORDERS_KEY, orderReorder);

export const useReceiveReorder = () =>
  useMutation(REORDERS_KEY, receiveReorder, { alsoInvalidate: ["inventory"] });

export const useCancelReorder = () => useMutation(REORDERS_KEY, cancelReorder);
