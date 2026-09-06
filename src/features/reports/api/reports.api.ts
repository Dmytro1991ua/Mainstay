import type { PaginatedResponse } from "@/shared/hooks/use-crud";
import { axiosInstance } from "@/shared/lib/api-client";
import type { components } from "@/shared/types/api-generated";

export type AssetReliabilityRow = components["schemas"]["AssetReliabilityRow"];
export type ThroughputReport = components["schemas"]["ThroughputResponse"]["data"];
export type ThroughputBucket = components["schemas"]["ThroughputBucket"];
export type ThroughputGranularity = ThroughputReport["groupBy"];

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
