import { AlertTriangle, ClipboardList, Clock, Package, PackageX } from "lucide-react";

import type { ChartConfig } from "@/shared/ui/chart";

import { SkeletonChart, SkeletonCategoryBreakdown, SkeletonWidget } from "./DashboardSkeletons";
import { DueThisWeekList } from "./DueThisWeekList";
import { InventoryCategoryBreakdown } from "./InventoryCategoryBreakdown";
import { LowStockList } from "./LowStockList";
import { OverdueTasksList } from "./OverdueTasksList";
import { RecentNotifications } from "./RecentNotifications";
import { RecentTasks } from "./RecentTasks";
import { TaskStatusChart } from "./TaskStatusChart";

import type { DashboardWidgetConfig, StatCardVariant } from "./types";
import type { Notification, Task } from "../api/dashboard-api";
import type { LucideIcon } from "lucide-react";

type StatsKey = "totalItems" | "lowStockCount" | "outOfStockCount" | "activeTasks" | "overdueCount";

export type Stats = Record<StatsKey, number> & { totalTasks: number };

type StatCardDef = {
  key: StatsKey;
  label: string;
  icon: LucideIcon;
  variant?: (value: number) => StatCardVariant;
  subtext?: (value: number, stats: Stats) => string | undefined;
};

export const STATS_CARDS_CONFIG: StatCardDef[] = [
  { key: "totalItems", label: "Inventory Items", icon: Package },
  {
    key: "lowStockCount",
    label: "Low Stock",
    icon: AlertTriangle,
    variant: (value) => (value > 0 ? "red" : "default"),
    subtext: (value) => (value > 0 ? "Need reordering" : "All stocked"),
  },
  {
    key: "outOfStockCount",
    label: "Out of Stock",
    icon: PackageX,
    variant: (value) => (value > 0 ? "red" : "default"),
    subtext: (value) => (value > 0 ? "Zero units remaining" : "All items have stock"),
  },
  {
    key: "activeTasks",
    label: "Active Tasks",
    icon: ClipboardList,
    variant: (value) => (value > 0 ? "accent" : "default"),
    subtext: (_, stats) => (stats.totalTasks > 0 ? `of ${stats.totalTasks} total` : undefined),
  },
  {
    key: "overdueCount",
    label: "Overdue Tasks",
    icon: Clock,
    variant: (value) => (value > 0 ? "red" : "default"),
    subtext: (value) => (value > 0 ? "Past due date" : "All on track"),
  },
];

export const DASHBOARD_WIDGETS_CONFIG: DashboardWidgetConfig[] = [
  {
    key: "task-breakdown",
    title: "Task Breakdown",
    skeleton: <SkeletonChart />,
    viewAllTo: "/tasks",
    render: ({ taskStatusData }) => <TaskStatusChart data={taskStatusData} />,
  },
  {
    key: "low-stock",
    title: "Low Stock Items",
    skeleton: <SkeletonWidget />,
    viewAllTo: "/inventory",
    render: ({ lowStockItems }) => <LowStockList items={lowStockItems} />,
  },
  {
    key: "recent-tasks",
    title: "Recent Tasks",
    skeleton: <SkeletonWidget />,
    viewAllTo: "/tasks",
    render: ({ recentTasks }) => <RecentTasks tasks={recentTasks} />,
  },
  {
    key: "unread-alerts",
    title: "Unread Alerts",
    skeleton: <SkeletonWidget />,
    viewAllTo: "/notifications",
    badge: ({ unreadCount }) => (unreadCount > 0 ? unreadCount : undefined),
    render: ({ recentNotifications }) => (
      <RecentNotifications notifications={recentNotifications} />
    ),
  },
  {
    key: "overdue-tasks",
    title: "Overdue Maintenance",
    skeleton: <SkeletonWidget />,
    viewAllTo: "/tasks",
    render: ({ overdueTasks }) => <OverdueTasksList tasks={overdueTasks} />,
  },
  {
    key: "due-this-week",
    title: "Due This Week",
    skeleton: <SkeletonWidget />,
    viewAllTo: "/tasks",
    render: ({ dueThisWeekTasks }) => <DueThisWeekList tasks={dueThisWeekTasks} />,
  },
  {
    key: "inventory-by-category",
    title: "Inventory by Category",
    skeleton: <SkeletonCategoryBreakdown />,
    fullWidth: true,
    viewAllTo: "/inventory",
    render: ({ categoryBreakdown }) => <InventoryCategoryBreakdown breakdown={categoryBreakdown} />,
  },
];

export const STATUS_LABEL_CONFIG: Record<Task["status"], string> = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

export const STATUS_CLASS_CONFIG: Record<Task["status"], string> = {
  OPEN: "bg-accent-soft text-accent",
  IN_PROGRESS: "bg-amber-soft text-amber",
  DONE: "bg-green-soft text-green",
};

type NotificationTypeDef = {
  icon: LucideIcon;
  iconClass: string;
  bgClass: string;
};

export const NOTIFICATION_TYPE_CONFIG: Record<Notification["type"], NotificationTypeDef> = {
  LOW_STOCK: { icon: AlertTriangle, iconClass: "text-amber", bgClass: "bg-amber-soft" },
  TASK_OVERDUE: { icon: Clock, iconClass: "text-red", bgClass: "bg-red-soft" },
};

export const STAT_CARD_VARIANT_CONFIG: Record<
  StatCardVariant,
  { soft: string; icon: string; leftBorder: string }
> = {
  default: { soft: "bg-accent", icon: "text-white", leftBorder: "border-l-accent" },
  accent: { soft: "bg-accent", icon: "text-white", leftBorder: "border-l-accent" },
  amber: { soft: "bg-amber", icon: "text-white", leftBorder: "border-l-amber" },
  red: { soft: "bg-red", icon: "text-white", leftBorder: "border-l-red" },
  green: { soft: "bg-green", icon: "text-white", leftBorder: "border-l-green" },
};

export const TASK_CHART_CONFIG = {
  open: { label: "Open", color: "var(--accent)" },
  inprogress: { label: "In Progress", color: "var(--amber)" },
  done: { label: "Done", color: "var(--green)" },
} satisfies ChartConfig;

export const TASK_CHART_LEGEND_CONFIG = [
  { key: "open", label: "Open" },
  { key: "inprogress", label: "In Progress" },
  { key: "done", label: "Done" },
] as const;
