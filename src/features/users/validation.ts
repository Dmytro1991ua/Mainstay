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
