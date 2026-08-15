import { z } from "zod";

export const TASK_PRIORITIES = ["LOW", "MEDIUM", "HIGH"] as const;

export const TASK_FORM_DEFAULTS = {
  title: "",
  description: "",
  assignedTo: "",
  dueDate: "",
  priority: "MEDIUM" as const,
};

export const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  assignedTo: z.string().min(1, "Assignee is required"),
  dueDate: z.string().min(1, "Due date is required"),
  priority: z.enum(TASK_PRIORITIES),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;
