import { formatMinutes } from "@/features/time-tracking";

const MINUTES_PER_HOUR = 60;
const MINUTES_PER_DAY = 1440;

/** 90 -> "1h 30m", 3000 -> "2d 2h", null -> "—". Repair and failure times often run to days. */
export const formatDowntimeDuration = (minutes: number | null): string => {
  if (minutes === null) return "—";
  if (minutes < MINUTES_PER_DAY) return formatMinutes(minutes);

  const days = Math.floor(minutes / MINUTES_PER_DAY);
  const hours = Math.floor((minutes % MINUTES_PER_DAY) / MINUTES_PER_HOUR);

  return hours === 0 ? `${days}d` : `${days}d ${hours}h`;
};

/** A datetime-local value is the viewer's local time; the API wants an ISO instant. Empty means "now". */
export const toIsoDateTime = (local: string): string | undefined =>
  local === "" ? undefined : new Date(local).toISOString();

/** The server sends null when the window has no measurable time. */
export const formatAvailability = (percent: number | null): string =>
  percent === null ? "—" : `${percent.toFixed(1)}%`;
