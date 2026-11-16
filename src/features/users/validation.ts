import { z } from "zod";

import { isValidMoneyInput, MONEY_INPUT_ERROR } from "@/shared/utils";

export const inviteUserSchema = z.object({
  email: z.email({ error: "Invalid email address" }),
  role: z.enum(["MANAGER", "TECHNICIAN"], { error: "Please select a role" }),
});

export type InviteUserFormValues = z.infer<typeof inviteUserSchema>;

export const INVITE_USER_DEFAULTS: InviteUserFormValues = {
  email: "",
  role: "TECHNICIAN",
};

export const hourlyRateSchema = z.object({
  // Empty clears the rate, so only a filled-in value has to be a valid amount.
  hourlyRate: z
    .string()
    .trim()
    .refine((value) => value === "" || isValidMoneyInput(value), MONEY_INPUT_ERROR),
});

export type HourlyRateFormValues = z.infer<typeof hourlyRateSchema>;

export const HOURLY_RATE_DEFAULTS: HourlyRateFormValues = { hourlyRate: "" };
