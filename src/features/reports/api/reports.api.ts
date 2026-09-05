import { axiosInstance } from "@/shared/lib/api-client";
import type { components } from "@/shared/types/api-generated";

export type AssetReliabilityRow = components["schemas"]["AssetReliabilityRow"];
export type ThroughputReport = components["schemas"]["ThroughputResponse"]["data"];
export type ThroughputBucket = components["schemas"]["ThroughputBucket"];
export type ThroughputGranularity = ThroughputReport["groupBy"];

export type ThroughputParams = {
  from?: string;
  to?: string;
  groupBy?: ThroughputGranularity;
};

export const fetchAssetReliability = async (): Promise<AssetReliabilityRow[]> => {
  const res =
    await axiosInstance.get<components["schemas"]["AssetReliabilityResponse"]>("/reports/assets");

  return res.data.data;
};

export const fetchThroughput = async (params: ThroughputParams): Promise<ThroughputReport> => {
  const res = await axiosInstance.get<components["schemas"]["ThroughputResponse"]>(
    "/reports/throughput",
    { params },
  );

  return res.data.data;
};
