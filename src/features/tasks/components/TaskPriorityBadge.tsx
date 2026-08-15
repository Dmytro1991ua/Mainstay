import { cn } from "@/shared/lib/utils";

import { TASK_PRIORITY_CONFIG } from "../config";

import type { TaskPriority } from "../api/tasks.api";

export const TaskPriorityBadge = ({ priority }: { priority: TaskPriority }) => {
  const { label, className } = TASK_PRIORITY_CONFIG[priority];
  return (
    <span className={cn("rounded-md border px-1.5 py-px text-[11px] font-semibold", className)}>
      {label}
    </span>
  );
};
