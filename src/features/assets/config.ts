import type { FilterConfig } from "@/shared/ui/data-table";
import { PillStatus } from "@/shared/ui/pill";

import type { AssetStatus } from "./api/assets.api";
import type { AssetFormValues } from "./validation";

export const ASSET_STATUS_PILL: Record<AssetStatus, PillStatus> = {
  OPERATIONAL: PillStatus.Operational,
  DOWN: PillStatus.Down,
  RETIRED: PillStatus.Retired,
};

export const ASSET_STATUS_OPTIONS = [
  { value: "OPERATIONAL", label: "Operational" },
  { value: "DOWN", label: "Down" },
  { value: "RETIRED", label: "Retired" },
];

export type AssetFieldConfig = {
  name: keyof AssetFormValues;
  label: string;
  type?: string;
  placeholder?: string;
  inputClassName?: string;
  readonlyInEdit?: boolean;
  select?: "category" | "status";
  colSpan?: 1 | 2;
};

export const ASSET_FORM_FIELDS: AssetFieldConfig[] = [
  { name: "name", label: "Asset name", placeholder: "e.g. Rooftop HVAC Unit #2", colSpan: 2 },
  {
    name: "serialNumber",
    label: "Serial number",
    placeholder: "e.g. HVAC-RTU-002",
    inputClassName: "font-mono text-xs",
    readonlyInEdit: true,
    colSpan: 2,
  },
  { name: "category", label: "Category", placeholder: "Select a category", select: "category" },
  { name: "status", label: "Status", placeholder: "Select a status", select: "status" },
  { name: "location", label: "Location", placeholder: "e.g. Building A — Roof", colSpan: 2 },
  { name: "manufacturer", label: "Manufacturer", placeholder: "e.g. Carrier" },
  { name: "model", label: "Model", placeholder: "e.g. 48TCED12" },
  { name: "installDate", label: "Install date", type: "date", colSpan: 2 },
];

export const ASSET_FILTER_CONFIG: FilterConfig[] = [
  {
    id: "status",
    label: "Status",
    type: "single",
    options: ASSET_STATUS_OPTIONS,
  },
];
