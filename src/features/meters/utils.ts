import { formatReading } from "@/shared/utils";

import type { RecordReadingResult } from "./api/meters.api";

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
