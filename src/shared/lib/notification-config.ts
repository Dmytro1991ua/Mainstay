import { AlertTriangle, Bell, Clock, PackageX } from "lucide-react";

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
};
