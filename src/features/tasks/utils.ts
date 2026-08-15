import { format } from "date-fns";

import type { TableUrlState } from "@/shared/ui/data-table";

import type { Task, TaskListParams } from "./api/tasks.api";

export const isTaskOverdue = (task: Pick<Task, "dueDate" | "status">): boolean =>
  task.status !== "DONE" && !!task.dueDate && new Date(task.dueDate) < new Date();

export const formatDueDate = (dueDate: string | null): string => {
  if (!dueDate) return "—";
  return format(new Date(dueDate), "MMM d, yyyy");
};

export const buildTaskParams = (tableState: TableUrlState): TaskListParams => {
  const [activeSort] = tableState.sorting ?? [];
  return {
    search: tableState.search || undefined,
    status: tableState.filters?.status?.[0] as TaskListParams["status"],
    priority: tableState.filters?.priority?.[0] as TaskListParams["priority"],
    assignedTo: tableState.filters?.assignedTo?.[0],
    overdue: tableState.filters?.overdue?.[0] === "true" ? true : undefined,
    sortBy: (activeSort?.id as TaskListParams["sortBy"]) ?? "createdAt",
    sortOrder: activeSort?.desc ? "desc" : "asc",
    limit: 25,
  };
};

export const getUserInitials = (userName: string): string =>
  userName
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");
