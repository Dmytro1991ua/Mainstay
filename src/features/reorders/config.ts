import { Ban, PackageCheck, Truck } from "lucide-react";

import type { FilterConfig } from "@/shared/ui/data-table";
import { PillStatus } from "@/shared/ui/pill";

import type { ReorderStatus } from "./api/reorders.api";
import type { ReorderActionConfig, ReorderActionType } from "./types";

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

export const REORDER_ACTIONS: Record<ReorderActionType, ReorderActionConfig> = {
  order: {
    icon: Truck,
    buttonLabel: "Mark ordered",
    buttonVariant: "outline",
    title: "Mark as ordered",
    confirmLabel: "Mark ordered",
    dialogVariant: "default",
    iconClass: "text-accent",
    describe: (r) => `Mark the reorder for "${r.inventoryItem.name}" as ordered.`,
  },
  receive: {
    icon: PackageCheck,
    buttonLabel: "Mark received",
    buttonVariant: "outline",
    title: "Mark as received",
    confirmLabel: "Mark received",
    dialogVariant: "default",
    iconClass: "text-green",
    describe: (r) =>
      `Receiving adds ${r.quantity} units to "${r.inventoryItem.name}" stock. This can't be undone.`,
  },
  cancel: {
    icon: Ban,
    buttonLabel: "Cancel",
    buttonVariant: "ghost",
    title: "Cancel reorder",
    confirmLabel: "Cancel reorder",
    dialogVariant: "destructive",
    iconClass: "text-red",
    describe: (r) =>
      `Cancel the reorder for "${r.inventoryItem.name}"? A new one can be raised later.`,
  },
};

// Which lifecycle actions each status offers (terminal statuses offer none).
export const REORDER_STATUS_ACTIONS: Record<ReorderStatus, ReorderActionType[]> = {
  PENDING: ["order", "cancel"],
  ORDERED: ["receive", "cancel"],
  RECEIVED: [],
  CANCELLED: [],
};
