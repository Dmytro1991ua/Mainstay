import { z } from "zod";

export const TASK_FORM_DEFAULTS = {
  title: "",
  description: "",
  assignedTo: "",
  dueDate: "",
};

export const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  assignedTo: z.string().min(1, "Assignee is required"),
  dueDate: z.string().min(1, "Due date is required"),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;
