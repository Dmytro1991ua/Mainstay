import { z } from "zod";

export const RECURRING_TASK_FORM_DEFAULTS = {
  title: "",
  description: "",
  assignedTo: "",
  priority: "MEDIUM" as const,
  category: "" as string,
  intervalDays: 7,
  nextDueAt: "",
};

export const recurringTaskFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  assignedTo: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  category: z.string().optional(),
  intervalDays: z.number().int().min(1, "Must be at least 1 day"),
  nextDueAt: z.string().min(1, "First due date is required"),
});

export type RecurringTaskFormValues = z.infer<typeof recurringTaskFormSchema>;
