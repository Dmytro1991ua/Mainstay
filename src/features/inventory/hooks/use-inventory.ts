import { useQuery } from "@tanstack/react-query";

import { useInfiniteQueryList, useMutation } from "@/shared/hooks/use-crud";

import {
  createInventoryItem,
  deleteInventoryItem,
  fetchInventory,
  fetchInventoryCategories,
  updateInventoryItem,
  type InventoryItem,
  type InventoryListParams,
  type UpdateInventoryItemInput,
} from "../api/inventory.api";

export const INVENTORY_KEY = "inventory";

export const useInventoryQuery = (params: InventoryListParams) =>
  useInfiniteQueryList<InventoryItem, InventoryListParams>(INVENTORY_KEY, params, fetchInventory);

export const useInventoryCategoriesQuery = () =>
  useQuery({
    queryKey: [INVENTORY_KEY, "categories"],
    queryFn: fetchInventoryCategories,
    staleTime: Infinity,
  });

export const useCreateInventory = () => useMutation(INVENTORY_KEY, createInventoryItem);

export const useUpdateInventory = () =>
  useMutation(INVENTORY_KEY, ({ id, data }: { id: string; data: UpdateInventoryItemInput }) =>
    updateInventoryItem(id, data),
  );

export const useDeleteInventory = () => useMutation(INVENTORY_KEY, deleteInventoryItem);
