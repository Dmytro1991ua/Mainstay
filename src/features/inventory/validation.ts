import { z } from "zod";

export const FORM_DEFAULTS: InventoryFormValues = {
  name: "",
  serialNumber: "",
  category: "",
  quantity: "0",
  minStockLevel: "0",
};

const numericField = z
  .string()
  .min(1, "This field is required")
  .refine(
    (v) => Number.isFinite(Number(v)) && Number.isInteger(Number(v)) && Number(v) >= 0,
    "Must be a whole number (0 or more)",
  );

export const inventoryFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  serialNumber: z.string().min(1, "Serial number is required"),
  category: z.string().min(1, "Category is required"),
  quantity: numericField,
  minStockLevel: numericField,
});

export type InventoryFormValues = z.infer<typeof inventoryFormSchema>;
