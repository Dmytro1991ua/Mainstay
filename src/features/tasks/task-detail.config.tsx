import { format, formatDistanceToNow } from "date-fns";
import { FileText } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import type { DetailField } from "@/shared/ui/detail-shell";
import { Pill } from "@/shared/ui/pill";

import { InlineStatusSelect } from "./components/InlineStatusSelect";
import { OverdueBadge } from "./components/OverdueBadge";
import { TASK_STATUS_PILL } from "./config";
import { formatDueDate, getUserInitials, isTaskOverdue } from "./utils";

import type { Task } from "./api/tasks.api";

type FieldOptions = {
  canEditStatus: boolean;
};

export const getTaskDetailFields = (task: Task, { canEditStatus }: FieldOptions): DetailField[] => {
  const isOverdue = isTaskOverdue(task);

  return [
    {
      label: "Status",
      value: canEditStatus ? (
        <InlineStatusSelect task={task} />
      ) : (
        <Pill status={TASK_STATUS_PILL[task.status]} />
      ),
    },
    {
      label: "Assigned to",
      value: task.assignee ? (
        <div className="flex items-center gap-2">
          <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-[10.5px] font-semibold text-accent">
            {getUserInitials(task.assignee.userName)}
          </div>
          <div>
            <span className="font-medium text-text">{task.assignee.userName}</span>
            <span className="ml-2 text-xs text-text-3">{task.assignee.email}</span>
          </div>
        </div>
      ) : (
        <span className="text-text-3">Unassigned</span>
      ),
    },
    {
      label: "Due date",
      value: task.dueDate ? (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={cn("font-medium", isOverdue ? "text-amber" : "text-text")}>
            {formatDueDate(task.dueDate)}
          </span>
          {isOverdue && <OverdueBadge />}
        </div>
      ) : (
        <span className="text-text-3">—</span>
      ),
    },
    {
      label: "Created",
      value: <span className="text-text-2">{format(new Date(task.createdAt), "MMM d, yyyy")}</span>,
    },
    {
      label: "Last updated",
      value: (
        <span className="text-text-2">
          {formatDistanceToNow(new Date(task.updatedAt), { addSuffix: true })}
        </span>
      ),
    },
    {
      label: "Description",
      value: task.description ? (
        <p className="whitespace-pre-wrap leading-relaxed text-text">{task.description}</p>
      ) : (
        <div className="flex items-center gap-1.5 italic text-text-3">
          <FileText className="size-3.5 shrink-0 opacity-50" />
          No description provided.
        </div>
      ),
    },
  ];
};
