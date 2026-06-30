import { z } from "zod";

export const loginSchema = z.object({
  email: z.email({ error: "Invalid email address" }),
  password: z.string().min(1, { error: "Password is required" }),
});

export const registerSchema = z
  .object({
    userName: z
      .string()
      .min(3, { error: "Username must be at least 3 characters" })
      .max(30, { error: "Username must be at most 30 characters" })
      .regex(/^\w+$/, {
        error: "Username can only contain letters, numbers and underscores",
      }),
    email: z.email({ error: "Invalid email address" }),
    password: z
      .string()
      .min(8, { error: "Password must be at least 8 characters" })
      .max(64, { error: "Password must be at most 64 characters" })
      .regex(/[A-Z]/, { error: "Password must contain at least one uppercase letter" })
      .regex(/\d/, { error: "Password must contain at least one number" }),
    confirmPassword: z.string().min(1, { error: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
