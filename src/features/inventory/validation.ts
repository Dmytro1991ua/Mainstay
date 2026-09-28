import { z } from "zod";

export const FORM_DEFAULTS: InventoryFormValues = {
  name: "",
  serialNumber: "",
  category: "",
  quantity: "0",
  minStockLevel: "0",
  reorderPoint: "",
  reorderQuantity: "",
  supplier: "",
};

const isWholeNonNegative = (v: string) =>
  Number.isFinite(Number(v)) && Number.isInteger(Number(v)) && Number(v) >= 0;

const numericField = z
  .string()
  .min(1, "This field is required")
  .refine(isWholeNonNegative, "Must be a whole number (0 or more)");

// Optional numeric — "" means "not set".
const optionalNumericField = z
  .string()
  .refine((v) => v === "" || isWholeNonNegative(v), "Must be a whole number (0 or more)");

export const inventoryFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  serialNumber: z.string().min(1, "Serial number is required"),
  category: z.string().min(1, "Category is required"),
  quantity: numericField,
  minStockLevel: numericField,
  reorderPoint: optionalNumericField,
  reorderQuantity: optionalNumericField,
  supplier: z.string(),
});

export type InventoryFormValues = z.infer<typeof inventoryFormSchema>;
