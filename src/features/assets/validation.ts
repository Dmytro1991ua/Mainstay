import { z } from "zod";

export const assetFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  serialNumber: z.string().min(1, "Serial number is required"),
  category: z.string().min(1, "Category is required"),
  location: z.string().min(1, "Location is required"),
  status: z.enum(["OPERATIONAL", "DOWN", "RETIRED"]),
  manufacturer: z.string(),
  model: z.string(),
  installDate: z.string(),
});

export type AssetFormValues = z.infer<typeof assetFormSchema>;

export const FORM_DEFAULTS: AssetFormValues = {
  name: "",
  serialNumber: "",
  category: "",
  location: "",
  status: "OPERATIONAL",
  manufacturer: "",
  model: "",
  installDate: "",
};
