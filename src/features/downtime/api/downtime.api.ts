import { axiosInstance } from "@/shared/lib/api-client";
import type { components } from "@/shared/types/api-generated";

export type DowntimeReport = components["schemas"]["DowntimeListResponse"]["data"];
export type DowntimeSummary = DowntimeReport["summary"];
export type DowntimeEvent = components["schemas"]["DowntimeEvent"];

export const fetchDowntime = async (assetId: string): Promise<DowntimeReport> => {
  const res = await axiosInstance.get<components["schemas"]["DowntimeListResponse"]>(
    `/assets/${assetId}/downtime`,
  );

  return res.data.data;
};
