import type { FilterConfig } from "@/shared/ui/data-table";
import { PillStatus } from "@/shared/ui/pill";

export const TASK_STATUS_PILL: Record<"OPEN" | "IN_PROGRESS" | "DONE", PillStatus> = {
  OPEN: PillStatus.Open,
  IN_PROGRESS: PillStatus.InProgress,
  DONE: PillStatus.Done,
};

export const TASK_STATUS_OPTIONS = [
  { value: "OPEN", label: "Open" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "DONE", label: "Done" },
];

export const TASK_FILTER_CONFIG: FilterConfig[] = [
  {
    id: "status",
    label: "Status",
    type: "single",
    options: [
      { label: "Open", value: "OPEN" },
      { label: "In Progress", value: "IN_PROGRESS" },
      { label: "Done", value: "DONE" },
    ],
  },
  {
    id: "overdue",
    label: "Overdue",
    type: "single",
    options: [{ label: "Overdue only", value: "true" }],
  },
];
