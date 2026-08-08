import type { TaskTab } from "./hooks/use-tasks-tab";

export const TECHNICIAN_TASK_NOTICE = "You can only update status on tasks assigned to you.";

export const TASK_TABS: { key: TaskTab; label: string }[] = [
  { key: "all", label: "All Tasks" },
  { key: "mine", label: "My Tasks" },
];
