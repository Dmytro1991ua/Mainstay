import { useState } from "react";

import { getApiErrorMessage } from "@/shared/lib/api-error";
import { useAuthStore } from "@/shared/stores/auth-store";
import { toast } from "@/shared/ui/toast";

import { useCreateTimeEntry, useDeleteTimeEntry, useTimeEntries } from "./use-time-entries";

import type { CreateTimeEntryInput, TimeEntry } from "../api/time-entries.api";

export const useTaskTimeSection = (taskId: string) => {
  const { data: summary, isPending, isError, refetch } = useTimeEntries(taskId);
  const createMutation = useCreateTimeEntry(taskId);
  const deleteMutation = useDeleteTimeEntry(taskId);

  const user = useAuthStore((s) => s.user);
  const isManager = user?.roles.some((r) => r === "ADMIN" || r === "MANAGER") ?? false;

  const [pendingDelete, setPendingDelete] = useState<TimeEntry | null>(null);

  const canDelete = (entry: TimeEntry) => entry.user?.id === user?.id || isManager;

  const addEntry = async (data: CreateTimeEntryInput): Promise<boolean> => {
    try {
      await createMutation.mutateAsync(data);

      return true;
    } catch (error) {
      toast.error("Failed to log time", { description: getApiErrorMessage(error) });

      return false;
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;

    try {
      await deleteMutation.mutateAsync(pendingDelete.id);

      toast.success("Time entry deleted");
    } catch (error) {
      toast.error("Failed to delete time entry", { description: getApiErrorMessage(error) });
    } finally {
      setPendingDelete(null);
    }
  };

  return {
    summary,
    isPending,
    isError,
    refetch,
    isSubmitting: createMutation.isPending,
    pendingDelete,
    setPendingDelete,
    canDelete,
    addEntry,
    confirmDelete,
  };
};
