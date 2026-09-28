import { axiosInstance } from "@/shared/lib/api-client";
import type { components } from "@/shared/types/api-generated";

export type Reorder = components["schemas"]["Reorder"];
export type ReorderStatus = Reorder["status"];
export type CreateReorderInput = components["schemas"]["CreateReorderInput"];

export type ReorderSortBy = "createdAt" | "status";

export type ReorderListParams = {
  page?: number;
  limit?: number;
  status?: ReorderStatus;
  inventoryItemId?: string;
  sortBy?: ReorderSortBy;
  sortOrder?: "asc" | "desc";
};

export const fetchReorders = async (params: ReorderListParams) => {
  const res = await axiosInstance.get<components["schemas"]["ReordersListResponse"]>("/reorders", {
    params,
  });

  return res.data;
};

export const createReorder = async (data: CreateReorderInput) => {
  const res = await axiosInstance.post<components["schemas"]["ReorderResponse"]>("/reorders", data);
  return res.data.data;
};

export const orderReorder = async (id: string) => {
  const res = await axiosInstance.patch<components["schemas"]["ReorderResponse"]>(
    `/reorders/${id}/order`,
  );
  return res.data.data;
};

export const receiveReorder = async (id: string) => {
  const res = await axiosInstance.patch<components["schemas"]["ReorderResponse"]>(
    `/reorders/${id}/receive`,
  );
  return res.data.data;
};

export const cancelReorder = async (id: string) => {
  const res = await axiosInstance.patch<components["schemas"]["ReorderResponse"]>(
    `/reorders/${id}/cancel`,
  );
  return res.data.data;
};
