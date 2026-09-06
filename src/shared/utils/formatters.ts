import { differenceInDays, differenceInHours, differenceInMinutes, format } from "date-fns";

type TimeStep = {
  limit: number;
  measure: (now: Date, date: Date) => number;
  unit: string;
};

const MINS_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const DAYS_PER_WEEK = 7;

const TIME_STEPS: TimeStep[] = [
  { limit: MINS_PER_HOUR, measure: differenceInMinutes, unit: "m" },
  { limit: HOURS_PER_DAY, measure: differenceInHours, unit: "h" },
  { limit: DAYS_PER_WEEK, measure: differenceInDays, unit: "d" },
];

export const formatShortDate = (iso: string) => format(new Date(iso), "MMM d");

const ENUM_ACRONYMS: Record<string, string> = { HVAC: "HVAC", IT: "IT" };

/** "IT_EQUIPMENT" → "IT Equipment", "OPERATIONAL" → "Operational". */
export const formatEnumLabel = (value: string): string =>
  value
    .split("_")
    .map(
      (word) => ENUM_ACRONYMS[word] ?? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    )
    .join(" ");

export const formatUserName = (userName: string): string =>
  userName
    .split("_")
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : ""))
    .join(" ");

export const getInitials = (name: string): string => {
  const words = name.trim().split(/\s+/);
  return words.length > 1
    ? words
        .slice(0, 2)
        .map((w) => w[0] ?? "")
        .join("")
    : name.slice(0, 2);
};

export const formatTimeAgo = (iso: string): string => {
  const date = new Date(iso);
  const now = new Date();

  if (differenceInMinutes(now, date) < 1) return "just now";

  for (const { limit, measure, unit } of TIME_STEPS) {
    const count = measure(now, date);

    if (count < limit) return `${count}${unit} ago`;
  }

  return formatShortDate(iso);
};
