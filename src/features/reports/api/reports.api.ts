import type { PaginatedResponse } from "@/shared/hooks/use-crud";
import { axiosInstance } from "@/shared/lib/api-client";
import type { components } from "@/shared/types/api-generated";

export type AssetReliabilityRow = components["schemas"]["AssetReliabilityRow"];
export type ThroughputReport = components["schemas"]["ThroughputResponse"]["data"];
export type ThroughputBucket = components["schemas"]["ThroughputBucket"];
export type ThroughputGranularity = ThroughputReport["groupBy"];
export type TechnicianWorkloadRow = components["schemas"]["TechnicianWorkloadRow"];

export type TechnicianSortBy =
  | "openTasks"
  | "inProgressTasks"
  | "overdueTasks"
  | "completedTasks"
  | "nextDueAt"
  | "userName";

export type TechnicianListParams = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: TechnicianSortBy;
  sortOrder?: "asc" | "desc";
};

export type ReliabilitySortBy =
  | "totalTasks"
  | "openTasks"
  | "overdueTasks"
  | "completedTasks"
  | "partsConsumed"
  | "avgCompletionDays"
  | "name";

export type ReliabilityListParams = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
  sortBy?: ReliabilitySortBy;
  sortOrder?: "asc" | "desc";
};

export type ThroughputParams = {
  from?: string;
  to?: string;
  groupBy?: ThroughputGranularity;
};

export const fetchAssetReliability = async (
  params: ReliabilityListParams,
): Promise<PaginatedResponse<AssetReliabilityRow>> => {
  const res = await axiosInstance.get<components["schemas"]["AssetReliabilityResponse"]>(
    "/reports/assets",
    { params },
  );

  return { data: res.data.data, meta: res.data.meta };
};

export const fetchThroughput = async (params: ThroughputParams): Promise<ThroughputReport> => {
  const res = await axiosInstance.get<components["schemas"]["ThroughputResponse"]>(
    "/reports/throughput",
    { params },
  );

  return res.data.data;
};

export const fetchTechnicianWorkload = async (
  params: TechnicianListParams,
): Promise<PaginatedResponse<TechnicianWorkloadRow>> => {
  const res = await axiosInstance.get<components["schemas"]["TechnicianWorkloadResponse"]>(
    "/reports/technicians",
    { params },
  );

  return { data: res.data.data, meta: res.data.meta };
};
