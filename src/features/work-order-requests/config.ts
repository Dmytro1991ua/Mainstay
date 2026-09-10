import type { FilterConfig } from "@/shared/ui/data-table";
import { PillStatus } from "@/shared/ui/pill";

import type { WorkOrderRequestStatus } from "./api/work-order-requests.api";

export const WORK_ORDER_STATUS_PILL: Record<WorkOrderRequestStatus, PillStatus> = {
  PENDING: PillStatus.Pending,
  APPROVED: PillStatus.Approved,
  REJECTED: PillStatus.Rejected,
};

export const WORK_ORDER_STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

// The list endpoint filters by status only (priority/category are display-only).
export const WORK_ORDER_FILTER_CONFIG: FilterConfig[] = [
  { id: "status", label: "Status", type: "single", options: WORK_ORDER_STATUS_OPTIONS },
];
