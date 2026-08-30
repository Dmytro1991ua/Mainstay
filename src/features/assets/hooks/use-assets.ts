import { useQuery } from "@tanstack/react-query";

import { useInfiniteQueryList, useMutation } from "@/shared/hooks/use-crud";

import {
  createAsset,
  deleteAsset,
  fetchAssetCategories,
  fetchAssets,
  fetchAssetStats,
  fetchAssetTasks,
  updateAsset,
  type Asset,
  type AssetListParams,
  type UpdateAssetInput,
} from "../api/assets.api";

export const ASSETS_KEY = "assets";

export const useAssetsQuery = (params: AssetListParams) =>
  useInfiniteQueryList<Asset, AssetListParams>(ASSETS_KEY, params, fetchAssets);

export const useAssetCategoriesQuery = () =>
  useQuery({
    queryKey: [ASSETS_KEY, "categories"],
    queryFn: fetchAssetCategories,
    staleTime: Infinity,
  });

export const useAssetStatsQuery = () =>
  useQuery({
    queryKey: [ASSETS_KEY, "stats"],
    queryFn: fetchAssetStats,
    staleTime: 60_000,
  });

export const useAssetTasksQuery = (id: string) =>
  useQuery({
    queryKey: [ASSETS_KEY, id, "tasks"],
    queryFn: () => fetchAssetTasks(id),
    staleTime: 30_000,
  });

export const useCreateAsset = () => useMutation(ASSETS_KEY, createAsset);

export const useUpdateAsset = () =>
  useMutation(ASSETS_KEY, ({ id, data }: { id: string; data: UpdateAssetInput }) =>
    updateAsset(id, data),
  );

export const useDeleteAsset = () => useMutation(ASSETS_KEY, deleteAsset);
