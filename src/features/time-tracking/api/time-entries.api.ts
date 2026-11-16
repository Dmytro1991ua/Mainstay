import { axiosInstance } from "@/shared/lib/api-client";
import type { components } from "@/shared/types/api-generated";

export type TimeEntry = components["schemas"]["TimeEntry"];
export type TimeEntriesSummary = components["schemas"]["TimeEntriesSummary"];
export type CreateTimeEntryInput = components["schemas"]["CreateTimeEntryInput"];

export const fetchTimeEntries = async (taskId: string): Promise<TimeEntriesSummary> => {
  const res = await axiosInstance.get<components["schemas"]["TimeEntriesListResponse"]>(
    `/tasks/${taskId}/time-entries`,
  );

  return res.data.data;
};

export const createTimeEntry = async (taskId: string, data: CreateTimeEntryInput) => {
  const res = await axiosInstance.post<components["schemas"]["TimeEntryResponse"]>(
    `/tasks/${taskId}/time-entries`,
    data,
  );

  return res.data.data;
};

export const deleteTimeEntry = async (taskId: string, entryId: string) => {
  await axiosInstance.delete(`/tasks/${taskId}/time-entries/${entryId}`);
};
