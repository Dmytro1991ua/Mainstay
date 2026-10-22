import { format } from "date-fns";

import { formatReading } from "@/shared/utils";

import type {
  RecurringTask,
  RecurringTaskCategory,
  UpdateRecurringTaskInput,
} from "./api/recurring-tasks.api";
import type { ActiveFilter } from "./types";
import type { RecurringTaskFormValues } from "./validation";

export const toIsActive = (filter: ActiveFilter): boolean | undefined => {
  if (filter === "active") return true;
  if (filter === "paused") return false;
  return undefined;
};

export const isMeterSchedule = (schedule: RecurringTask): boolean =>
  schedule.triggerType === "METER";

const formatDays = (days: number, style: "short" | "long"): string => {
  if (style === "short") return `${days}d`;

  const unit = days === 1 ? "day" : "days";

  return `${days} ${unit}`;
};

/** "7 days" (or "7d" when `short`) for time schedules, "250 hrs" for meter schedules. */
export const getScheduleIntervalLabel = (
  schedule: RecurringTask,
  style: "short" | "long" = "long",
): string | null => {
  if (isMeterSchedule(schedule)) {
    if (schedule.intervalReading == null || !schedule.meter) return null;

    return formatReading(schedule.intervalReading, schedule.meter.unit);
  }

  return schedule.intervalDays == null ? null : formatDays(schedule.intervalDays, style);
};

/** "Jun 15, 2027" for time schedules, "At 1,500 hrs" for meter schedules. */
export const getScheduleNextDueLabel = (schedule: RecurringTask): string | null => {
  if (isMeterSchedule(schedule)) {
    if (schedule.nextDueReading == null || !schedule.meter) return null;

    return `At ${formatReading(schedule.nextDueReading, schedule.meter.unit)}`;
  }

  return schedule.nextDueAt == null ? null : format(new Date(schedule.nextDueAt), "MMM d, yyyy");
};

/** Only time schedules send their interval: a meter schedule's meter and interval are locked. */
export const toUpdateSchedulePayload = (
  values: RecurringTaskFormValues,
): UpdateRecurringTaskInput => ({
  title: values.title,
  description: values.description || undefined,
  assignedTo: values.assignedTo || null,
  priority: values.priority,
  category: (values.category as RecurringTaskCategory) || undefined,
  ...(values.triggerType === "TIME" && { intervalDays: values.intervalDays }),
});
