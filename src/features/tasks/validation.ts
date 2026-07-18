import { z } from "zod";

export const TASK_FORM_DEFAULTS = {
  title: "",
  description: "",
  status: "OPEN" as const,
  assignedTo: "",
  dueDate: "",
};

export const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["OPEN", "IN_PROGRESS", "DONE"]),
  assignedTo: z.string().optional(),
  dueDate: z.string().optional(),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;
