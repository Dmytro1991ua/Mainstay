import type { FilterConfig } from "@/shared/ui/data-table";
import { PillStatus } from "@/shared/ui/pill";

import type { ReorderStatus } from "./api/reorders.api";

export const REORDER_STATUS_PILL: Record<ReorderStatus, PillStatus> = {
  PENDING: PillStatus.Pending,
  ORDERED: PillStatus.Ordered,
  RECEIVED: PillStatus.Received,
  CANCELLED: PillStatus.Cancelled,
};

export const REORDER_STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "ORDERED", label: "Ordered" },
  { value: "RECEIVED", label: "Received" },
  { value: "CANCELLED", label: "Cancelled" },
];

export const REORDER_FILTER_CONFIG: FilterConfig[] = [
  { id: "status", label: "Status", type: "single", options: REORDER_STATUS_OPTIONS },
];
