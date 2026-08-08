import { ClipboardList } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { EmptyState } from "@/shared/ui/empty-state";
import { formatShortDate } from "@/shared/utils/formatters";

import { isTaskOverdue } from "../utils";

import { STATUS_CLASS_CONFIG, STATUS_LABEL_CONFIG } from "./configs";
import { Initials } from "./Initials";

import type { Task } from "../api/dashboard-api";

export const RecentTasks = ({ tasks }: { tasks: Task[] }) => {
  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        message="No tasks yet."
        description="Assigned tasks will appear here."
      />
    );
  }

  return (
    <div className="divide-y divide-border">
      {tasks.map((task) => {
        const overdue = isTaskOverdue(task);
        return (
          <div key={task.id} className="flex items-center gap-3 py-2.5">
            {task.assignee && <Initials name={task.assignee.userName} />}
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "truncate text-sm font-medium",
                  task.status === "DONE" ? "text-text-3" : "text-text",
                )}
              >
                {task.title}
              </p>
              {task.assignee && (
                <p className="truncate text-[12px] text-text-3">{task.assignee.userName}</p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {task.dueDate && (
                <span
                  className={cn(
                    "text-[12px] tabular-nums",
                    overdue ? "font-medium text-amber" : "text-text-3",
                  )}
                >
                  {formatShortDate(task.dueDate)}
                </span>
              )}
              {overdue && (
                <span className="rounded-md bg-amber-soft px-1.5 py-0.5 text-[11px] font-medium text-amber">
                  Overdue
                </span>
              )}
              <span
                className={cn(
                  "rounded-md px-1.5 py-0.5 text-[11px] font-medium",
                  STATUS_CLASS_CONFIG[task.status],
                )}
              >
                {STATUS_LABEL_CONFIG[task.status]}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
