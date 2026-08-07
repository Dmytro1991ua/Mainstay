import { axiosInstance } from "@/shared/lib/api-client";
import type { components } from "@/shared/types/api-generated";

export type InventoryItem = components["schemas"]["InventoryItem"];
export type InventoryCategory = InventoryItem["category"];
export type InventoryStatus = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
export type CreateInventoryItemInput = components["schemas"]["CreateInventoryItemInput"];
export type UpdateInventoryItemInput = components["schemas"]["UpdateInventoryItemInput"];

export type InventoryListParams = {
  page?: number;
  limit?: number;
  sortBy?: "name" | "quantity" | "category" | "createdAt";
  sortOrder?: "asc" | "desc";
  search?: string;
  category?: InventoryCategory;
  status?: InventoryStatus;
};

export const fetchInventory = async (params: InventoryListParams) => {
  const res = await axiosInstance.get<components["schemas"]["InventoryListResponse"]>(
    "/inventory",
    { params },
  );

  return res.data;
};

export const fetchInventoryCategories = async () => {
  const res =
    await axiosInstance.get<components["schemas"]["InventoryCategoriesResponse"]>(
      "/inventory/categories",
    );

  return res.data.data;
};

export const createInventoryItem = async (data: CreateInventoryItemInput) => {
  const res = await axiosInstance.post<components["schemas"]["InventoryItemResponse"]>(
    "/inventory",
    data,
  );

  return res.data.data;
};

export const updateInventoryItem = async (id: string, data: UpdateInventoryItemInput) => {
  const res = await axiosInstance.patch<components["schemas"]["InventoryItemResponse"]>(
    `/inventory/${id}`,
    data,
  );

  return res.data.data;
};

export const deleteInventoryItem = async (id: string) => {
  await axiosInstance.delete(`/inventory/${id}`);
};

export const restockInventoryItem = async (id: string, quantityToAdd: number) => {
  const res = await axiosInstance.patch<components["schemas"]["InventoryItemResponse"]>(
    `/inventory/${id}/restock`,
    { quantityToAdd },
  );

  return res.data.data;
};
