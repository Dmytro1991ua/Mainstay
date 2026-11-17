import { z } from "zod";

export const inviteUserSchema = z.object({
  email: z.email({ error: "Invalid email address" }),
  role: z.enum(["MANAGER", "TECHNICIAN"], { error: "Please select a role" }),
});

export type InviteUserFormValues = z.infer<typeof inviteUserSchema>;

export const INVITE_USER_DEFAULTS: InviteUserFormValues = {
  email: "",
  role: "TECHNICIAN",
};

// Same limit as the server: up to 5 digits before the decimal point, at most 2 after it.
const HOURLY_RATE_PATTERN = /^\d{1,5}(\.\d{1,2})?$/;
const HOURLY_RATE_ERROR = "Enter an amount up to 99999.99 (max 2 decimals)";

export const hourlyRateSchema = z.object({
  // Empty clears the rate, so only a filled-in value has to be a valid amount.
  hourlyRate: z
    .string()
    .trim()
    .refine((value) => value === "" || HOURLY_RATE_PATTERN.test(value), HOURLY_RATE_ERROR),
});

export type HourlyRateFormValues = z.infer<typeof hourlyRateSchema>;

export const HOURLY_RATE_DEFAULTS: HourlyRateFormValues = { hourlyRate: "" };
