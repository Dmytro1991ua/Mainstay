import { useQueries } from "@tanstack/react-query";

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
      { queryKey: ["dashboard", "inventoryStats"], queryFn: getInventoryStats, staleTime: STALE },
      { queryKey: ["dashboard", "lowStock"], queryFn: getLowStockItems, staleTime: STALE },
      {
        queryKey: ["dashboard", "tasksOpen"],
        queryFn: () => getTasksCount("OPEN"),
        staleTime: STALE,
      },
      {
        queryKey: ["dashboard", "tasksInProgress"],
        queryFn: () => getTasksCount("IN_PROGRESS"),
        staleTime: STALE,
      },
      {
        queryKey: ["dashboard", "tasksDone"],
        queryFn: () => getTasksCount("DONE"),
        staleTime: STALE,
      },
      {
        queryKey: ["dashboard", "overdueCount"],
        queryFn: getOverdueTasksCount,
        staleTime: STALE,
      },
      {
        queryKey: ["dashboard", "unreadCount"],
        queryFn: getUnreadNotificationsCount,
        staleTime: STALE,
      },
      { queryKey: ["dashboard", "recentTasks"], queryFn: getRecentTasks, staleTime: STALE },
      {
        queryKey: ["dashboard", "recentNotifications"],
        queryFn: getRecentNotifications,
        staleTime: STALE,
      },
      { queryKey: ["dashboard", "overdueTasks"], queryFn: getOverdueTasks, staleTime: STALE },
      {
        queryKey: ["dashboard", "dueThisWeek"],
        queryFn: getDueThisWeekTasks,
        staleTime: STALE,
      },
    ],
  });

  const isLoading =
    inventoryStats.isPending ||
    lowStock.isPending ||
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
