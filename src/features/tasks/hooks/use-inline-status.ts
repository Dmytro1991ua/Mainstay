import { useState } from "react";

import { getApiErrorMessage } from "@/shared/lib/api-error";
import { useAuthStore } from "@/shared/stores/auth-store";
import { PILL_CONFIG } from "@/shared/ui/pill";
import { toast } from "@/shared/ui/toast";

import { TASK_STATUS_OPTIONS, TASK_STATUS_PILL } from "../config";

import { useUpdateTask } from "./use-tasks";

import type { Task, TaskStatus } from "../api/tasks.api";

export const useInlineStatus = (task: Task, onRequestStart?: () => void) => {
  const { mutateAsync, isPending } = useUpdateTask();

  const roles = useAuthStore((s) => s.user?.roles ?? []);

  const [optimistic, setOptimistic] = useState<TaskStatus | null>(null);

  const isTechnician =
    roles.includes("TECHNICIAN") && !roles.some((r) => r === "ADMIN" || r === "MANAGER");
  const statusOptions = isTechnician
    ? TASK_STATUS_OPTIONS.filter((o) => o.value !== "CANCELLED")
    : TASK_STATUS_OPTIONS;

  const current = optimistic ?? task.status;
  const pillStatus = TASK_STATUS_PILL[current];
  const { className: pillClass, dotClassName } = PILL_CONFIG[pillStatus];

  const handleChange = async (newStatus: string) => {
    if (newStatus === "IN_PROGRESS" && onRequestStart) {
      onRequestStart();
      return;
    }
    setOptimistic(newStatus as TaskStatus);
    try {
      await mutateAsync({
        id: task.id,
        data: { status: newStatus as "OPEN" | "IN_PROGRESS" },
      });
      setOptimistic(null);
    } catch (error) {
      setOptimistic(null);
      toast.error("Failed to update status", { description: getApiErrorMessage(error) });
    }
  };

  return { current, pillStatus, pillClass, dotClassName, isPending, handleChange, statusOptions };
};
