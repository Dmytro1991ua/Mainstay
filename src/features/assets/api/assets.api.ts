import { axiosInstance } from "@/shared/lib/api-client";
import type { components } from "@/shared/types/api-generated";

export type Asset = components["schemas"]["Asset"];
export type AssetCategory = Asset["category"];
export type AssetStatus = Asset["status"];
export type CreateAssetInput = components["schemas"]["CreateAssetInput"];
export type UpdateAssetInput = components["schemas"]["UpdateAssetInput"];
export type AssetStats = components["schemas"]["AssetStatsResponse"]["data"];
export type AssetTask = components["schemas"]["Task"];

export type AssetListParams = {
  page?: number;
  limit?: number;
  sortBy?: "name" | "category" | "status" | "location" | "createdAt";
  sortOrder?: "asc" | "desc";
  search?: string;
  category?: AssetCategory;
  status?: AssetStatus;
};

export const fetchAssets = async (params: AssetListParams) => {
  const res = await axiosInstance.get<components["schemas"]["AssetListResponse"]>("/assets", {
    params,
  });

  return res.data;
};

export const fetchAssetCategories = async () => {
  const res =
    await axiosInstance.get<components["schemas"]["AssetCategoriesResponse"]>("/assets/categories");

  return res.data.data;
};

export const fetchAssetStats = async () => {
  const res = await axiosInstance.get<components["schemas"]["AssetStatsResponse"]>("/assets/stats");

  return res.data.data;
};

export const getAsset = async (id: string): Promise<Asset> => {
  const res = await axiosInstance.get<components["schemas"]["AssetResponse"]>(`/assets/${id}`);
  return res.data.data;
};

export const createAsset = async (data: CreateAssetInput) => {
  const res = await axiosInstance.post<components["schemas"]["AssetResponse"]>("/assets", data);
  return res.data.data;
};

export const updateAsset = async (id: string, data: UpdateAssetInput) => {
  const res = await axiosInstance.patch<components["schemas"]["AssetResponse"]>(
    `/assets/${id}`,
    data,
  );
  return res.data.data;
};

export const deleteAsset = async (id: string) => {
  await axiosInstance.delete(`/assets/${id}`);
};

export const ASSET_TASKS_LIMIT = 50;

export const fetchAssetTasks = async (id: string) => {
  const res = await axiosInstance.get<components["schemas"]["TasksListResponse"]>(
    `/assets/${id}/tasks`,
    { params: { limit: ASSET_TASKS_LIMIT } },
  );

  return res.data;
};
