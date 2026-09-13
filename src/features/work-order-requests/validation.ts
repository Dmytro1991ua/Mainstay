import { z } from "zod";

export const workOrderRequestFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be 200 characters or fewer"),
  description: z.string().max(2000, "Description must be 2000 characters or fewer"),
  // "" means "no category / no asset" — mapped to undefined on submit.
  category: z.string(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  assetId: z.string(),
});

export type WorkOrderRequestFormValues = z.infer<typeof workOrderRequestFormSchema>;

export const FORM_DEFAULTS: WorkOrderRequestFormValues = {
  title: "",
  description: "",
  category: "",
  priority: "MEDIUM",
  assetId: "",
};

export const workOrderApproveSchema = z.object({
  // Both optional — "" means "leave unassigned / no due date".
  assignedTo: z.string(),
  dueDate: z.string(),
});

export type WorkOrderApproveValues = z.infer<typeof workOrderApproveSchema>;

export const APPROVE_DEFAULTS: WorkOrderApproveValues = {
  assignedTo: "",
  dueDate: "",
};
