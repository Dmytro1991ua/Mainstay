import type { DowntimeEvent } from "./api/downtime.api";

type DowntimeReason = DowntimeEvent["reason"];

export const DOWNTIME_REASON_LABELS: Record<DowntimeReason, string> = {
  BREAKDOWN: "Breakdown",
  PLANNED: "Planned",
};

export const DOWNTIME_REASON_OPTIONS = (
  Object.entries(DOWNTIME_REASON_LABELS) as [DowntimeReason, string][]
).map(([value, label]) => ({ value, label }));
