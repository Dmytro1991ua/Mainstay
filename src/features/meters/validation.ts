import { z } from "zod";

import { formatReading } from "@/shared/utils";

// Readings are Postgres integers.
export const MAX_READING = 2_147_483_647;

// Digits only: rules out signs, decimals and a comma used as a decimal separator.
export const WHOLE_NUMBER_PATTERN = /^\d+$/;
export const WHOLE_NUMBER_ERROR = "Must be a whole number (0 or more)";
export const READING_TOO_LARGE_ERROR = "That number is too large";

export const meterFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  unit: z.string().trim().min(1, "Unit is required"),
  initialReading: z
    .string()
    .trim()
    .regex(WHOLE_NUMBER_PATTERN, WHOLE_NUMBER_ERROR)
    .refine((v) => Number(v) <= MAX_READING, READING_TOO_LARGE_ERROR),
});

export type MeterFormValues = z.infer<typeof meterFormSchema>;

/**
 * Error for a typed new reading, or undefined when it is empty or valid. A reading can only go up
 * (equal is accepted), so it must be at least the current reading.
 */
export const getReadingError = (
  value: string,
  currentReading: number,
  unit: string,
): string | undefined => {
  const trimmed = value.trim();

  if (trimmed === "") return undefined;
  if (!WHOLE_NUMBER_PATTERN.test(trimmed)) return WHOLE_NUMBER_ERROR;

  const reading = Number(trimmed);

  if (reading > MAX_READING) return READING_TOO_LARGE_ERROR;
  if (reading < currentReading) return `Must be at least ${formatReading(currentReading, unit)}`;

  return undefined;
};

export const METER_FORM_DEFAULTS: MeterFormValues = {
  name: "",
  unit: "",
  initialReading: "0",
};
