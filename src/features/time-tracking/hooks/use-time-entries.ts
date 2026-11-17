import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createTimeEntry, deleteTimeEntry, fetchTimeEntries } from "../api/time-entries.api";

import type { CreateTimeEntryInput } from "../api/time-entries.api";

const TIME_ENTRIES_KEY = "task-time-entries";
const timeEntriesKey = (taskId: string) => [TIME_ENTRIES_KEY, taskId];

export const useTimeEntries = (taskId: string) =>
  useQuery({
    queryKey: timeEntriesKey(taskId),
    queryFn: () => fetchTimeEntries(taskId),
    staleTime: 30_000,
  });

export const useCreateTimeEntry = (taskId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTimeEntryInput) => createTimeEntry(taskId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: timeEntriesKey(taskId) }),
  });
};

export const useDeleteTimeEntry = (taskId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (entryId: string) => deleteTimeEntry(taskId, entryId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: timeEntriesKey(taskId) }),
  });
};
