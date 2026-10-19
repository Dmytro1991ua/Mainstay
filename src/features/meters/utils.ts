import type { RecurringTask } from "@/features/recurring-tasks/api/recurring-tasks.api";
import { formatReading } from "@/shared/utils";

import type { Meter, RecordReadingResult } from "./api/meters.api";

type UpcomingService = RecurringTask & { nextDueReading: number };

const isUpcomingServiceFor =
  (meter: Meter) =>
  (schedule: RecurringTask): schedule is UpcomingService =>
    schedule.isActive && schedule.meterId === meter.id && schedule.nextDueReading != null;

/**
 * "Oil change · due at 1,250 hours · 10 hours to go". Once the reading has reached the due point
 * the schedule has fired (or its task is still open), so it says "reached" instead.
 */
const formatServiceLine = (meter: Meter, { title, nextDueReading }: UpcomingService): string => {
  const remaining = nextDueReading - meter.currentReading;
  const status = remaining > 0 ? `${formatReading(remaining, meter.unit)} to go` : "reached";

  return `${title} · due at ${formatReading(nextDueReading, meter.unit)} · ${status}`;
};

/** What maintenance a meter is driving: one line per active meter schedule, nearest first. */
export const getNextServiceLines = (meter: Meter, schedules: RecurringTask[]): string[] =>
  schedules
    .filter(isUpcomingServiceFor(meter))
    .sort((a, b) => a.nextDueReading - b.nextDueReading)
    .map((schedule) => formatServiceLine(meter, schedule));

/**
 * Message for a recorded reading. Created tasks are only mentioned when the server returned some:
 * a crossed threshold doesn't always create one (paused schedule, task already open).
 */
export const getReadingSuccessMessage = ({
  meter,
  triggeredTasks,
}: RecordReadingResult): string => {
  const base = `${meter.name} is now ${formatReading(meter.currentReading, meter.unit)}.`;

  if (triggeredTasks.length === 0) return base;

  const noun = triggeredTasks.length === 1 ? "task" : "tasks";
  const titles = triggeredTasks.map((task) => `"${task.title}"`).join(", ");

  return `${base} Created maintenance ${noun}: ${titles}.`;
};
