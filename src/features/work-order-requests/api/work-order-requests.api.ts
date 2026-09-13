import { axiosInstance } from "@/shared/lib/api-client";
import type { components } from "@/shared/types/api-generated";

export type WorkOrderRequest = components["schemas"]["WorkOrderRequest"];
export type WorkOrderRequestStatus = WorkOrderRequest["status"];
export type WorkOrderRequestCategory = WorkOrderRequest["category"];
export type WorkOrderRequestPriority = WorkOrderRequest["priority"];
export type CreateWorkOrderRequestInput = components["schemas"]["CreateWorkOrderRequestInput"];
export type ApproveWorkOrderRequestInput = components["schemas"]["ApproveWorkOrderRequestInput"];
export type RejectWorkOrderRequestInput = components["schemas"]["RejectWorkOrderRequestInput"];

export type WorkOrderRequestSortBy = "createdAt" | "priority" | "status";

export type WorkOrderRequestListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: WorkOrderRequestStatus;
  sortBy?: WorkOrderRequestSortBy;
  sortOrder?: "asc" | "desc";
};

export const fetchWorkOrderRequests = async (params: WorkOrderRequestListParams) => {
  const res = await axiosInstance.get<components["schemas"]["WorkOrderRequestsListResponse"]>(
    "/work-order-requests",
    { params },
  );

  return res.data;
};

export const getWorkOrderRequest = async (id: string): Promise<WorkOrderRequest> => {
  const res = await axiosInstance.get<components["schemas"]["WorkOrderRequestResponse"]>(
    `/work-order-requests/${id}`,
  );

  return res.data.data;
};

export const createWorkOrderRequest = async (data: CreateWorkOrderRequestInput) => {
  const res = await axiosInstance.post<components["schemas"]["WorkOrderRequestResponse"]>(
    "/work-order-requests",
    data,
  );

  return res.data.data;
};

export const approveWorkOrderRequest = async (id: string, data: ApproveWorkOrderRequestInput) => {
  const res = await axiosInstance.post<components["schemas"]["WorkOrderRequestResponse"]>(
    `/work-order-requests/${id}/approve`,
    data,
  );

  return res.data.data;
};

export const rejectWorkOrderRequest = async (id: string, data: RejectWorkOrderRequestInput) => {
  const res = await axiosInstance.post<components["schemas"]["WorkOrderRequestResponse"]>(
    `/work-order-requests/${id}/reject`,
    data,
  );

  return res.data.data;
};
