import {
  AlertTriangle,
  Bell,
  CalendarClock,
  CheckCircle2,
  Clock,
  PackagePlus,
  PackageX,
  XCircle,
} from "lucide-react";

import type { components } from "@/shared/types/api-generated";

import type { LucideIcon } from "lucide-react";

export type NotificationType = components["schemas"]["Notification"]["type"];

type NotificationTypeDef = {
  icon: LucideIcon;
  iconClass: string;
  bgClass: string;
  label: string;
  unreadRowBg: string;
  unreadBorderClass: string;
};

export const FALLBACK_NOTIFICATION_TYPE: NotificationTypeDef = {
  icon: Bell,
  iconClass: "text-text-2",
  bgClass: "bg-panel-2",
  label: "Notification",
  unreadRowBg: "bg-panel-2",
  unreadBorderClass: "border-l-border",
};

export const getNotificationTypeConfig = (type: string): NotificationTypeDef =>
  (NOTIFICATION_TYPE_CONFIG as Record<string, NotificationTypeDef>)[type] ??
  FALLBACK_NOTIFICATION_TYPE;

export const NOTIFICATION_TYPE_CONFIG: Record<NotificationType, NotificationTypeDef> = {
  LOW_STOCK: {
    icon: AlertTriangle,
    iconClass: "text-orange",
    bgClass: "bg-orange-soft",
    label: "Low Stock",
    unreadRowBg: "bg-orange-soft",
    unreadBorderClass: "border-l-orange",
  },
  OUT_OF_STOCK: {
    icon: PackageX,
    iconClass: "text-red",
    bgClass: "bg-red-soft",
    label: "Out of Stock",
    unreadRowBg: "bg-red-soft",
    unreadBorderClass: "border-l-red",
  },
  TASK_OVERDUE: {
    icon: Clock,
    iconClass: "text-amber",
    bgClass: "bg-amber-soft",
    label: "Task Overdue",
    unreadRowBg: "bg-amber-soft",
    unreadBorderClass: "border-l-amber",
  },
  TASK_CANCELLED: {
    icon: XCircle,
    iconClass: "text-red",
    bgClass: "bg-red-soft",
    label: "Task Cancelled",
    unreadRowBg: "bg-red-soft",
    unreadBorderClass: "border-l-red",
  },
  // A heads-up before the due date — calmer accent, distinct from amber "overdue".
  TASK_DUE_SOON: {
    icon: CalendarClock,
    iconClass: "text-accent",
    bgClass: "bg-accent-soft",
    label: "Task Due Soon",
    unreadRowBg: "bg-accent-soft",
    unreadBorderClass: "border-l-accent",
  },
  WORK_ORDER_APPROVED: {
    icon: CheckCircle2,
    iconClass: "text-green",
    bgClass: "bg-green-soft",
    label: "Request Approved",
    unreadRowBg: "bg-green-soft",
    unreadBorderClass: "border-l-green",
  },
  WORK_ORDER_REJECTED: {
    icon: XCircle,
    iconClass: "text-red",
    bgClass: "bg-red-soft",
    label: "Request Rejected",
    unreadRowBg: "bg-red-soft",
    unreadBorderClass: "border-l-red",
  },
  REORDER_RAISED: {
    icon: PackagePlus,
    iconClass: "text-accent",
    bgClass: "bg-accent-soft",
    label: "Reorder Raised",
    unreadRowBg: "bg-accent-soft",
    unreadBorderClass: "border-l-accent",
  },
};
