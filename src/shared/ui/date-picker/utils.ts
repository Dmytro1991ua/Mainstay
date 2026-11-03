import { format, isSameYear, parseISO } from "date-fns";

import type { DateRange } from "./types";

/**
 * Converts an ISO date string (either "yyyy-MM-dd" or full ISO datetime) to a
 * local-midnight Date. Appending T00:00:00 before parseISO avoids the UTC-offset
 * shift that parseISO applies to date-only strings.
 */
export const parseDateString = (value: string): Date => {
  const normalized = value.includes("T") ? value : `${value}T00:00:00`;

  return parseISO(normalized);
};

export const formatSingleDate = (date: Date) => format(date, "MMM d, yyyy");

/**
 * Formats a calendar date the API stores without a time (e.g. install or warranty date).
 * The API returns it as midnight UTC ("2027-06-15T00:00:00.000Z"); formatting that instant in
 * the viewer's time zone shows the previous day west of UTC. Keeping only the date part and
 * reading it as a local date shows the day that was actually entered.
 */
export const formatCalendarDate = (iso: string): string =>
  formatSingleDate(parseDateString(iso.slice(0, 10)));

/** True when a calendar date is before today (in the viewer's time zone). */
export const isPastCalendarDate = (iso: string, today: Date = new Date()): boolean =>
  iso.slice(0, 10) < format(today, "yyyy-MM-dd");

/** The start year is only shown when the range crosses a year: "Oct 5 – Oct 29, 2026" vs "Nov 2, 2025 – Nov 2, 2026". */
export const formatDateRange = (range: DateRange, placeholder: string): string => {
  if (range.from && range.to) {
    const startFormat = isSameYear(range.from, range.to) ? "MMM d" : "MMM d, yyyy";

    return `${format(range.from, startFormat)} – ${format(range.to, "MMM d, yyyy")}`;
  }

  if (range.from) return format(range.from, "MMM d, yyyy");

  return placeholder;
};

export const getDatePickerLabel = (
  mode: "single" | "range",
  selected: Date | DateRange | undefined,
  placeholder: string,
): string => {
  if (!selected) return placeholder;

  if (mode === "single") return formatSingleDate(selected as Date);

  return formatDateRange(selected as DateRange, placeholder);
};

export const hasDatePickerValue = (
  mode: "single" | "range",
  selected: Date | DateRange | undefined,
): boolean => {
  if (!selected) return false;

  if (mode === "single") return true;

  return !!(selected as DateRange).from;
};
