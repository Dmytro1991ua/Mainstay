import { axiosInstance } from "@/shared/lib/api-client";
import type { components } from "@/shared/types/api-generated";

export type DowntimeReport = components["schemas"]["DowntimeListResponse"]["data"];
export type DowntimeSummary = DowntimeReport["summary"];
export type DowntimeEvent = components["schemas"]["DowntimeEvent"];
export type StartDowntimeInput = components["schemas"]["StartDowntimeInput"];
export type EndDowntimeInput = components["schemas"]["EndDowntimeInput"];

export const fetchDowntime = async (assetId: string): Promise<DowntimeReport> => {
  const res = await axiosInstance.get<components["schemas"]["DowntimeListResponse"]>(
    `/assets/${assetId}/downtime`,
  );

  return res.data.data;
};

export const startDowntime = async (assetId: string, data: StartDowntimeInput) => {
  const res = await axiosInstance.post<components["schemas"]["DowntimeEventResponse"]>(
    `/assets/${assetId}/downtime`,
    data,
  );

  return res.data.data;
};

export const endDowntime = async (assetId: string, downtimeId: string, data: EndDowntimeInput) => {
  const res = await axiosInstance.post<components["schemas"]["DowntimeEventResponse"]>(
    `/assets/${assetId}/downtime/${downtimeId}/end`,
    data,
  );

  return res.data.data;
};
