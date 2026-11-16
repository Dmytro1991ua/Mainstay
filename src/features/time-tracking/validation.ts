import { format } from "date-fns";
import { z } from "zod";

import { toTotalMinutes } from "./utils";

export const MAX_MINUTES_PER_ENTRY = 1440;

const WHOLE_NUMBER_PATTERN = /^\d*$/;
const WHOLE_NUMBER_ERROR = "Whole numbers only";

const today = () => format(new Date(), "yyyy-MM-dd");

/** A function, not a constant: "today" must be read when the form opens, not at page load. */
export const getTimeEntryDefaults = () => ({
  hours: "",
  minutes: "",
  workedOn: today(),
  note: "",
});

export const timeEntryFormSchema = z
  .object({
    hours: z.string().trim(),
    minutes: z.string().trim(),
    workedOn: z
      .string()
      .min(1, "Pick a date")
      .refine((value) => value <= today(), "Can't be in the future"),
    note: z.string().trim(),
  })
  .superRefine(({ hours, minutes }, ctx) => {
    const addIssue = (path: "hours" | "minutes", message: string) =>
      ctx.addIssue({ code: "custom", path: [path], message });

    const hoursValid = WHOLE_NUMBER_PATTERN.test(hours);
    const minutesValid = WHOLE_NUMBER_PATTERN.test(minutes);

    if (!hoursValid) addIssue("hours", WHOLE_NUMBER_ERROR);
    if (!minutesValid) addIssue("minutes", WHOLE_NUMBER_ERROR);
    if (!hoursValid || !minutesValid) return;

    const total = toTotalMinutes(hours, minutes);

    if (total < 1) addIssue("hours", "Enter the time");
    else if (total > MAX_MINUTES_PER_ENTRY) addIssue("hours", "Max 24 hours");
  });

export type TimeEntryFormValues = z.infer<typeof timeEntryFormSchema>;
