import { axiosInstance } from "@/shared/lib/api-client";
import type { components } from "@/shared/types/api-generated";

export type InventoryItem = components["schemas"]["InventoryItem"];
export type InventoryListResponse = components["schemas"]["InventoryListResponse"];

/** Server-supported sort fields (mirrors the OpenAPI `sortBy` enum). */
export type InventorySortField = "name" | "quantity" | "createdAt";
export type SortOrder = "asc" | "desc";

export type InventoryListParams = {
  page?: number;
  limit?: number;
  sortBy?: InventorySortField;
  sortOrder?: SortOrder;
  search?: string;
  lowStock?: boolean;
};

/**
 * Fetch one page of inventory. All list operations (sort/search/filter/paging)
 * are server-side — this is the single network boundary the table talks to.
 * `lowStock` is serialized as the string the API expects.
 */
export async function listInventory(params: InventoryListParams): Promise<InventoryListResponse> {
  const { data } = await axiosInstance.get<InventoryListResponse>("/inventory", {
    params: {
      page: params.page,
      limit: params.limit,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
      search: params.search || undefined,
      lowStock: params.lowStock ? "true" : undefined,
    },
  });
  return data;
}
