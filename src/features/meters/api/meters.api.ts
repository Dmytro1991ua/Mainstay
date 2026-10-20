import type { PaginatedResponse } from "@/shared/hooks/use-crud";
import { axiosInstance } from "@/shared/lib/api-client";
import type { components } from "@/shared/types/api-generated";

export type Meter = components["schemas"]["Meter"];
export type MeterReading = components["schemas"]["MeterReading"];
export type CreateMeterInput = components["schemas"]["CreateMeterInput"];
export type UpdateMeterInput = components["schemas"]["UpdateMeterInput"];
export type RecordReadingInput = components["schemas"]["RecordReadingInput"];
export type RecordReadingResult = components["schemas"]["RecordReadingResponse"]["data"];

export type MeterListParams = {
  page?: number;
  limit?: number;
  assetId?: string;
  sortBy?: "name" | "lastReadingAt" | "createdAt";
  sortOrder?: "asc" | "desc";
};

export const fetchMeters = async (params: MeterListParams) => {
  const res = await axiosInstance.get<components["schemas"]["MetersListResponse"]>("/meters", {
    params,
  });

  return res.data;
};

export const createMeter = async (data: CreateMeterInput) => {
  const res = await axiosInstance.post<components["schemas"]["MeterResponse"]>("/meters", data);

  return res.data.data;
};

export const updateMeter = async (id: string, data: UpdateMeterInput) => {
  const res = await axiosInstance.patch<components["schemas"]["MeterResponse"]>(
    `/meters/${id}`,
    data,
  );

  return res.data.data;
};

export const deleteMeter = async (id: string) => {
  await axiosInstance.delete(`/meters/${id}`);
};

export const METER_READINGS_PAGE_SIZE = 20;

export const fetchMeterReadings = async (
  id: string,
  page: number,
): Promise<PaginatedResponse<MeterReading>> => {
  const res = await axiosInstance.get<components["schemas"]["MeterReadingsListResponse"]>(
    `/meters/${id}/readings`,
    { params: { page, limit: METER_READINGS_PAGE_SIZE } },
  );

  return { data: res.data.data, meta: res.data.meta };
};

export const recordReading = async (
  id: string,
  data: RecordReadingInput,
): Promise<RecordReadingResult> => {
  const res = await axiosInstance.post<components["schemas"]["RecordReadingResponse"]>(
    `/meters/${id}/readings`,
    data,
  );

  return res.data.data;
};
