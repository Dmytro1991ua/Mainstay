import type { NotificationType, NotificationsParams } from "./api/notifications-api";

export type NotificationFilter = "ALL" | "UNREAD" | NotificationType;

export type FilterTab = {
  key: NotificationFilter;
  label: string;
  params: Omit<NotificationsParams, "page">;
};

export const FILTER_TABS: FilterTab[] = [
  { key: "ALL", label: "All", params: {} },
  { key: "UNREAD", label: "Unread", params: { isRead: "false" } },
  { key: "LOW_STOCK", label: "Low stock", params: { type: "LOW_STOCK" } },
  { key: "OUT_OF_STOCK", label: "Out of stock", params: { type: "OUT_OF_STOCK" } },
  { key: "TASK_OVERDUE", label: "Overdue", params: { type: "TASK_OVERDUE" } },
  { key: "TASK_DUE_SOON", label: "Due soon", params: { type: "TASK_DUE_SOON" } },
  { key: "WORK_ORDER_APPROVED", label: "Approved", params: { type: "WORK_ORDER_APPROVED" } },
  { key: "WORK_ORDER_REJECTED", label: "Rejected", params: { type: "WORK_ORDER_REJECTED" } },
];

export const SKEL_KEYS = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10"] as const;
