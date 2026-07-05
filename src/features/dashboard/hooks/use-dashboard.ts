import { useQueries } from "@tanstack/react-query";

import {
  getInventoryTotal,
  getLowStockItems,
  getRecentNotifications,
  getRecentTasks,
  getTasksCount,
  getUnreadNotificationsCount,
} from "../api/dashboard-api";

const STALE = 60_000;

export const useDashboard = () => {
  const [
    inventoryTotal,
    lowStock,
    openCount,
    inProgressCount,
    doneCount,
    recentTasks,
    unreadCount,
    recentNotifications,
  ] = useQueries({
    queries: [
      { queryKey: ["dashboard", "inventoryTotal"], queryFn: getInventoryTotal, staleTime: STALE },
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
      { queryKey: ["dashboard", "recentTasks"], queryFn: getRecentTasks, staleTime: STALE },
      {
        queryKey: ["dashboard", "unreadCount"],
        queryFn: getUnreadNotificationsCount,
        staleTime: STALE,
      },
      {
        queryKey: ["dashboard", "recentNotifications"],
        queryFn: getRecentNotifications,
        staleTime: STALE,
      },
    ],
  });

  const isLoading =
    inventoryTotal.isPending ||
    lowStock.isPending ||
    openCount.isPending ||
    inProgressCount.isPending ||
    doneCount.isPending ||
    recentTasks.isPending ||
    unreadCount.isPending ||
    recentNotifications.isPending;

  return {
    isLoading,
    stats: {
      totalItems: inventoryTotal.data ?? 0,
      lowStockCount: lowStock.data?.total ?? 0,
      activeTasks: (openCount.data ?? 0) + (inProgressCount.data ?? 0),
      unreadNotifications: unreadCount.data ?? 0,
    },
    taskStatusData: {
      open: openCount.data ?? 0,
      inprogress: inProgressCount.data ?? 0,
      done: doneCount.data ?? 0,
    },
    lowStockItems: lowStock.data?.items ?? [],
    recentTasks: recentTasks.data ?? [],
    recentNotifications: recentNotifications.data ?? [],
  };
};
