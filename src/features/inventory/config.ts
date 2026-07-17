import type { FilterConfig } from "@/shared/ui/data-table";

import type { InventoryFormValues } from "./validation";

export type InventoryFieldConfig = {
  name: keyof InventoryFormValues;
  label: string;
  type?: string;
  placeholder?: string;
  inputClassName?: string;
  readonlyInEdit?: boolean;
  isSelect?: boolean;
  colSpan?: 1 | 2;
};

export const INVENTORY_FORM_FIELDS: InventoryFieldConfig[] = [
  { name: "name", label: "Item name", placeholder: "e.g. HEPA Air Filter 20×25", colSpan: 2 },
  {
    name: "serialNumber",
    label: "Serial number",
    placeholder: "e.g. AF-2025-H",
    inputClassName: "font-mono text-xs",
    readonlyInEdit: true,
    colSpan: 2,
  },
  {
    name: "category",
    label: "Category",
    placeholder: "Select a category",
    isSelect: true,
    colSpan: 2,
  },
  { name: "quantity", label: "Quantity", type: "number", placeholder: "0" },
  { name: "minStockLevel", label: "Min stock level", type: "number", placeholder: "0" },
];

export const INVENTORY_FILTER_CONFIG: FilterConfig[] = [
  {
    id: "stock",
    label: "Stock level",
    type: "single",
    options: [
      { label: "In Stock", value: "IN_STOCK" },
      { label: "Low Stock", value: "LOW_STOCK" },
      { label: "Out of Stock", value: "OUT_OF_STOCK" },
    ],
  },
];
