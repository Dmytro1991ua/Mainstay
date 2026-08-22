import { format } from "date-fns";

import { TaskPriorityBadge } from "@/features/tasks/components/TaskPriorityBadge";
import type { DetailField } from "@/shared/ui/detail-shell";

import { RecurringTaskStatusBadge } from "./components/RecurringTaskStatusBadge";

import type { RecurringTask } from "./api/recurring-tasks.api";
import type { ActiveFilter } from "./types";

export const SCHEDULE_TABS: { key: ActiveFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "paused", label: "Paused" },
];

export const SCHEDULE_PRIORITY_OPTIONS = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "URGENT", label: "Urgent" },
];

export const SCHEDULE_CATEGORY_OPTIONS = [
  { value: "ELECTRICAL", label: "Electrical" },
  { value: "PLUMBING", label: "Plumbing" },
  { value: "HVAC", label: "HVAC" },
  { value: "TOOLS", label: "Tools" },
  { value: "FASTENERS", label: "Fasteners" },
  { value: "CHEMICALS", label: "Chemicals" },
  { value: "SAFETY", label: "Safety" },
  { value: "BUILDING_MATERIALS", label: "Building Materials" },
];

export const SCHEDULE_CATEGORY_LABEL: Record<string, string> = Object.fromEntries(
  SCHEDULE_CATEGORY_OPTIONS.map(({ value, label }) => [value, label]),
);

export const SCHEDULE_DETAIL_SKELETON_KEYS = [
  "Status",
  "Priority",
  "Category",
  "Repeats every",
  "Next due",
  "Assigned to",
  "Created by",
  "Description",
  "Created",
  "Last updated",
];

const UNSET = <span className="text-text-3">—</span>;

export const getScheduleDetailFields = (schedule: RecurringTask): DetailField[] => [
  { label: "Status", value: <RecurringTaskStatusBadge isActive={schedule.isActive} /> },
  { label: "Priority", value: <TaskPriorityBadge priority={schedule.priority} /> },
  {
    label: "Category",
    value: schedule.category ? (SCHEDULE_CATEGORY_LABEL[schedule.category] ?? UNSET) : UNSET,
  },
  {
    label: "Repeats every",
    value: (
      <span className="text-sm text-text">
        {schedule.intervalDays} {schedule.intervalDays === 1 ? "day" : "days"}
      </span>
    ),
  },
  {
    label: "Next due",
    value: (
      <span className="text-sm text-text">
        {format(new Date(schedule.nextDueAt), "MMM d, yyyy")}
      </span>
    ),
  },
  {
    label: "Assigned to",
    value: schedule.assignee ? (
      <span className="text-sm text-text">{schedule.assignee.userName}</span>
    ) : (
      UNSET
    ),
  },
  {
    label: "Created by",
    value: <span className="text-sm text-text">{schedule.creator.userName}</span>,
  },
  {
    label: "Description",
    value: schedule.description ? (
      <span className="whitespace-pre-wrap text-sm text-text">{schedule.description}</span>
    ) : (
      UNSET
    ),
  },
  {
    label: "Created",
    value: (
      <span className="text-sm text-text-2">
        {format(new Date(schedule.createdAt), "MMM d, yyyy")}
      </span>
    ),
  },
  {
    label: "Last updated",
    value: (
      <span className="text-sm text-text-2">
        {format(new Date(schedule.updatedAt), "MMM d, yyyy")}
      </span>
    ),
  },
];
