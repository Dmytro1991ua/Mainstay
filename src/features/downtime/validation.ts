import { z } from "zod";

// The date fields are datetime-local values ("2026-11-22T10:30"); empty means "now".
const pastOrNow = z
  .string()
  .refine((value) => value === "" || new Date(value) <= new Date(), "Can't be in the future");

const NOTE_MAX_LENGTH = 500;

export const startDowntimeSchema = z.object({
  reason: z.enum(["BREAKDOWN", "PLANNED"]),
  startedAt: pastOrNow,
  note: z.string().trim().max(NOTE_MAX_LENGTH, `Max ${NOTE_MAX_LENGTH} characters`),
});

export type StartDowntimeFormValues = z.infer<typeof startDowntimeSchema>;

export const START_DOWNTIME_DEFAULTS: StartDowntimeFormValues = {
  reason: "BREAKDOWN",
  startedAt: "",
  note: "",
};

export const endDowntimeSchema = z.object({ endedAt: pastOrNow });

export type EndDowntimeFormValues = z.infer<typeof endDowntimeSchema>;

export const END_DOWNTIME_DEFAULTS: EndDowntimeFormValues = { endedAt: "" };
