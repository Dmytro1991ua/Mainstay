import { z } from "zod";

import {
  MAX_READING,
  READING_TOO_LARGE_ERROR,
  WHOLE_NUMBER_ERROR,
  WHOLE_NUMBER_PATTERN,
} from "@/features/meters/validation";

export const TRIGGER_TYPES = ["TIME", "METER"] as const;

export type TriggerType = (typeof TRIGGER_TYPES)[number];

export const RECURRING_TASK_FORM_DEFAULTS = {
  title: "",
  description: "",
  assignedTo: "",
  priority: "MEDIUM" as const,
  category: "" as string,
  triggerType: "TIME" as TriggerType,
  intervalDays: 7,
  nextDueAt: "",
  meterId: "",
  intervalReading: "",
  firstDueReading: "",
};

export const recurringTaskFormSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    assignedTo: z.string().optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
    category: z.string().optional(),
    triggerType: z.enum(TRIGGER_TYPES),
    // Only one set of trigger fields applies, so each is checked below based on triggerType.
    intervalDays: z.number().catch(Number.NaN),
    nextDueAt: z.string(),
    meterId: z.string(),
    intervalReading: z.string().trim(),
    firstDueReading: z.string().trim(),
  })
  .superRefine((values, ctx) => {
    const addIssue = (path: string, message: string) =>
      ctx.addIssue({ code: "custom", path: [path], message });

    if (values.triggerType === "TIME") {
      if (!Number.isInteger(values.intervalDays) || values.intervalDays < 1) {
        addIssue("intervalDays", "Must be at least 1 day");
      }
      if (!values.nextDueAt) addIssue("nextDueAt", "First due date is required");

      return;
    }

    if (!values.meterId) addIssue("meterId", "Choose a meter");

    const intervalError = getRequiredReadingError(values.intervalReading);
    if (intervalError) addIssue("intervalReading", intervalError);

    const firstDueError = getOptionalReadingError(values.firstDueReading);
    if (firstDueError) addIssue("firstDueReading", firstDueError);
  });

const getOptionalReadingError = (value: string): string | undefined => {
  if (value === "") return undefined;

  if (!WHOLE_NUMBER_PATTERN.test(value)) return WHOLE_NUMBER_ERROR;
  if (Number(value) > MAX_READING) return READING_TOO_LARGE_ERROR;

  return undefined;
};

/** The interval is a distance, so 0 would mean "every 0 hours". */
const getRequiredReadingError = (value: string): string | undefined => {
  if (value === "") return "Interval is required";

  return getOptionalReadingError(value) ?? (Number(value) < 1 ? "Must be at least 1" : undefined);
};

export type RecurringTaskFormValues = z.infer<typeof recurringTaskFormSchema>;
