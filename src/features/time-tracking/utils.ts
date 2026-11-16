import type { TimeEntriesSummary } from "./api/time-entries.api";

const MINUTES_PER_HOUR = 60;

/** 90 -> "1h 30m", 120 -> "2h", 45 -> "45m". */
export const formatMinutes = (minutes: number): string => {
  const hours = Math.floor(minutes / MINUTES_PER_HOUR);
  const rest = minutes % MINUTES_PER_HOUR;

  if (hours === 0) return `${rest}m`;
  if (rest === 0) return `${hours}h`;

  return `${hours}h ${rest}m`;
};

/** Blank fields count as 0, so "2" hours and "" minutes is 120. */
export const toTotalMinutes = (hours: string, minutes: string): number =>
  Number(hours || 0) * MINUTES_PER_HOUR + Number(minutes || 0);

/** Cost fields are sent to managers only, so their absence means "don't show a cost". */
export const getUnratedNote = (summary: TimeEntriesSummary): string | undefined =>
  summary.unratedMinutes
    ? `Excludes ${formatMinutes(summary.unratedMinutes)} logged by people with no hourly rate`
    : undefined;
