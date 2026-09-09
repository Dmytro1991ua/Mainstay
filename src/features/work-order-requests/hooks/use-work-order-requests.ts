import { useQuery } from "@tanstack/react-query";

import { useInfiniteQueryList, useMutation } from "@/shared/hooks/use-crud";

import {
  approveWorkOrderRequest,
  createWorkOrderRequest,
  fetchWorkOrderRequests,
  getWorkOrderRequest,
  rejectWorkOrderRequest,
  type ApproveWorkOrderRequestInput,
  type RejectWorkOrderRequestInput,
  type WorkOrderRequest,
  type WorkOrderRequestListParams,
} from "../api/work-order-requests.api";

export const WORK_ORDER_REQUESTS_KEY = "work-order-requests";

export const useWorkOrderRequestsQuery = (
  params: WorkOrderRequestListParams,
  options?: { enabled?: boolean },
) =>
  useInfiniteQueryList<WorkOrderRequest, WorkOrderRequestListParams>(
    WORK_ORDER_REQUESTS_KEY,
    params,
    fetchWorkOrderRequests,
    options,
  );

export const useWorkOrderRequestQuery = (id: string) =>
  useQuery({
    queryKey: [WORK_ORDER_REQUESTS_KEY, id],
    queryFn: () => getWorkOrderRequest(id),
  });

export const useCreateWorkOrderRequest = () =>
  useMutation(WORK_ORDER_REQUESTS_KEY, createWorkOrderRequest);

// Approval spawns a linked task, so refresh the tasks list too.
export const useApproveWorkOrderRequest = () =>
  useMutation(
    WORK_ORDER_REQUESTS_KEY,
    ({ id, data }: { id: string; data: ApproveWorkOrderRequestInput }) =>
      approveWorkOrderRequest(id, data),
    { alsoInvalidate: ["tasks"] },
  );

export const useRejectWorkOrderRequest = () =>
  useMutation(
    WORK_ORDER_REQUESTS_KEY,
    ({ id, data }: { id: string; data: RejectWorkOrderRequestInput }) =>
      rejectWorkOrderRequest(id, data),
  );
