import { z } from "zod";

const MAX_READING = 2_147_483_647;

export const meterFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  unit: z.string().trim().min(1, "Unit is required"),
  initialReading: z
    .string()
    .trim()
    .regex(/^\d+$/, "Must be a whole number (0 or more)")
    .refine((v) => Number(v) <= MAX_READING, "That number is too large"),
});

export type MeterFormValues = z.infer<typeof meterFormSchema>;

export const METER_FORM_DEFAULTS: MeterFormValues = {
  name: "",
  unit: "",
  initialReading: "0",
};
