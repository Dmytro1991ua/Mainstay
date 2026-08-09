import { useQueries } from "@tanstack/react-query";

import { useAuthStore } from "@/shared/stores/auth-store";

import {
  getDueThisWeekTasks,
  getInventoryStats,
  getLowStockItems,
  getOverdueTasks,
  getOverdueTasksCount,
  getRecentNotifications,
  getRecentTasks,
  getTasksCount,
  getUnreadNotificationsCount,
} from "../api/dashboard-api";

const STALE = 60_000;

export const useDashboard = () => {
  const user = useAuthStore((s) => s.user);
  const isTechnician =
    (user?.roles.includes("TECHNICIAN") ?? false) &&
    !user?.roles.some((r) => r === "ADMIN" || r === "MANAGER");
  const userId = isTechnician ? user?.id : undefined;

  const [
    inventoryStats,
    lowStock,
    openCount,
    inProgressCount,
    doneCount,
    overdueCount,
    unreadCount,
    recentTasks,
    recentNotifications,
    overdueTasks,
    dueThisWeekTasks,
  ] = useQueries({
    queries: [
      {
        queryKey: ["dashboard", "inventoryStats"],
        queryFn: getInventoryStats,
        staleTime: STALE,
        enabled: !isTechnician,
      },
      {
        queryKey: ["dashboard", "lowStock"],
        queryFn: getLowStockItems,
        staleTime: STALE,
        enabled: !isTechnician,
      },
      {
        queryKey: ["dashboard", "tasksOpen", userId],
        queryFn: () => getTasksCount("OPEN", userId),
        staleTime: STALE,
      },
      {
        queryKey: ["dashboard", "tasksInProgress", userId],
        queryFn: () => getTasksCount("IN_PROGRESS", userId),
        staleTime: STALE,
      },
      {
        queryKey: ["dashboard", "tasksDone", userId],
        queryFn: () => getTasksCount("DONE", userId),
        staleTime: STALE,
      },
      {
        queryKey: ["dashboard", "overdueCount", userId],
        queryFn: () => getOverdueTasksCount(userId),
        staleTime: STALE,
      },
      {
        queryKey: ["dashboard", "unreadCount"],
        queryFn: getUnreadNotificationsCount,
        staleTime: STALE,
      },
      {
        queryKey: ["dashboard", "recentTasks", userId],
        queryFn: () => getRecentTasks(userId),
        staleTime: STALE,
      },
      {
        queryKey: ["dashboard", "recentNotifications"],
        queryFn: getRecentNotifications,
        staleTime: STALE,
      },
      {
        queryKey: ["dashboard", "overdueTasks", userId],
        queryFn: () => getOverdueTasks(userId),
        staleTime: STALE,
      },
      {
        queryKey: ["dashboard", "dueThisWeek", userId],
        queryFn: () => getDueThisWeekTasks(userId),
        staleTime: STALE,
      },
    ],
  });

  const inventoryIsLoading = !isTechnician && (inventoryStats.isPending || lowStock.isPending);
  const isLoading =
    inventoryIsLoading ||
    openCount.isPending ||
    inProgressCount.isPending ||
    doneCount.isPending ||
    overdueCount.isPending ||
    unreadCount.isPending ||
    recentTasks.isPending ||
    recentNotifications.isPending ||
    overdueTasks.isPending ||
    dueThisWeekTasks.isPending;

  const open = openCount.data ?? 0;
  const inProgress = inProgressCount.data ?? 0;
  const done = doneCount.data ?? 0;

  return {
    isLoading,
    isTechnician,
    stats: {
      totalItems: inventoryStats.data?.total ?? 0,
      lowStockCount: inventoryStats.data?.lowStock ?? 0,
      outOfStockCount: inventoryStats.data?.outOfStock ?? 0,
      activeTasks: open + inProgress,
      totalTasks: open + inProgress + done,
      overdueCount: overdueCount.data ?? 0,
    },
    taskStatusData: { open, inprogress: inProgress, done },
    lowStockItems: lowStock.data?.items ?? [],
    categoryBreakdown: inventoryStats.data?.byCategory ?? {},
    recentTasks: recentTasks.data ?? [],
    recentNotifications: recentNotifications.data ?? [],
    overdueTasks: overdueTasks.data ?? [],
    dueThisWeekTasks: dueThisWeekTasks.data ?? [],
    unreadCount: unreadCount.data ?? 0,
  };
};
