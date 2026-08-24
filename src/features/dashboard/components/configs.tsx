import {
  AlertTriangle,
  CalendarCheck,
  CalendarClock,
  ClipboardList,
  Clock,
  Package,
  PackageX,
} from "lucide-react";

import type { ChartConfig } from "@/shared/ui/chart";

import { SkeletonChart, SkeletonCategoryBreakdown, SkeletonWidget } from "./DashboardSkeletons";
import { DueThisWeekList } from "./DueThisWeekList";
import { InventoryCategoryBreakdown } from "./InventoryCategoryBreakdown";
import { LowStockList } from "./LowStockList";
import { OverdueTasksList } from "./OverdueTasksList";
import { RecentNotifications } from "./RecentNotifications";
import { RecentTasks } from "./RecentTasks";
import { TaskStatusChart } from "./TaskStatusChart";
import { TechnicianWorkload } from "./TechnicianWorkload";

import type { DashboardWidgetConfig, StatCardVariant } from "./types";
import type { Task } from "../api/dashboard-api";
import type { LucideIcon } from "lucide-react";

type StatsKey =
  | "totalItems"
  | "lowStockCount"
  | "outOfStockCount"
  | "activeTasks"
  | "overdueCount"
  | "activeSchedules"
  | "schedulesThisWeek";

export type Stats = Record<StatsKey, number> & { totalTasks: number };

type StatCardDef = {
  key: StatsKey;
  label: string;
  icon: LucideIcon;
  technicianHidden?: true;
  variant?: (value: number) => StatCardVariant;
  subtext?: (value: number, stats: Stats) => string | undefined;
};

export const STATS_CARDS_CONFIG: StatCardDef[] = [
  { key: "totalItems", label: "Inventory Items", icon: Package, technicianHidden: true },
  {
    key: "lowStockCount",
    label: "Low Stock",
    icon: AlertTriangle,
    technicianHidden: true,
    variant: (value) => (value > 0 ? "red" : "default"),
    subtext: (value) => (value > 0 ? "Need reordering" : "All stocked"),
  },
  {
    key: "outOfStockCount",
    label: "Out of Stock",
    icon: PackageX,
    technicianHidden: true,
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
  {
    key: "activeSchedules",
    label: "Active Schedules",
    icon: CalendarClock,
    technicianHidden: true,
    variant: (value) => (value > 0 ? "accent" : "default"),
    subtext: (value) => (value > 0 ? "Recurring schedules running" : "No active schedules"),
  },
  {
    key: "schedulesThisWeek",
    label: "Schedules Due",
    icon: CalendarCheck,
    technicianHidden: true,
    variant: (value) => (value > 0 ? "amber" : "default"),
    subtext: (value) => (value > 0 ? "Generating tasks this week" : "Nothing due this week"),
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
    technicianHidden: true,
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
    key: "technician-workload",
    title: "Technician Workload",
    skeleton: <SkeletonWidget />,
    viewAllTo: "/users",
    technicianHidden: true,
    fullWidth: true,
    render: ({ technicians }) => <TechnicianWorkload technicians={technicians} />,
  },
  {
    key: "inventory-by-category",
    title: "Inventory by Category",
    skeleton: <SkeletonCategoryBreakdown />,
    fullWidth: true,
    viewAllTo: "/inventory",
    technicianHidden: true,
    render: ({ categoryBreakdown }) => <InventoryCategoryBreakdown breakdown={categoryBreakdown} />,
  },
];

export const STATUS_LABEL_CONFIG: Record<Task["status"], string> = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
  CANCELLED: "Cancelled",
};

export const STATUS_CLASS_CONFIG: Record<Task["status"], string> = {
  OPEN: "bg-accent-soft text-accent",
  IN_PROGRESS: "bg-amber-soft text-amber",
  DONE: "bg-green-soft text-green",
  CANCELLED: "bg-red-soft text-red",
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
