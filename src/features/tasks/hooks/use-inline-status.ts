import { useState } from "react";

import { getApiErrorMessage } from "@/shared/lib/api-error";
import { PILL_CONFIG } from "@/shared/ui/pill";
import { toast } from "@/shared/ui/toast";

import { TASK_STATUS_PILL } from "../config";

import { useUpdateTask } from "./use-tasks";

import type { Task, TaskStatus } from "../api/tasks.api";

export const useInlineStatus = (task: Task) => {
  const { mutateAsync, isPending } = useUpdateTask();

  const [optimistic, setOptimistic] = useState<TaskStatus | null>(null);

  const current = optimistic ?? task.status;
  const pillStatus = TASK_STATUS_PILL[current];
  const { className: pillClass, dotClassName } = PILL_CONFIG[pillStatus];

  const handleChange = async (newStatus: string) => {
    setOptimistic(newStatus as TaskStatus);

    try {
      await mutateAsync({ id: task.id, data: { status: newStatus as TaskStatus } });

      setOptimistic(null);
    } catch (error) {
      setOptimistic(null);

      toast.error("Failed to update status", { description: getApiErrorMessage(error) });
    }
  };

  return { current, pillStatus, pillClass, dotClassName, isPending, handleChange };
};
