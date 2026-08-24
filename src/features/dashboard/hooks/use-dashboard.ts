import { useQueries } from "@tanstack/react-query";

import { useAuthStore } from "@/shared/stores/auth-store";

import {
  getDashboardStats,
  getDueThisWeekTasks,
  getInventoryStats,
  getLowStockItems,
  getOverdueTasks,
  getRecentNotifications,
  getRecentTasks,
  getUnreadNotificationsCount,
  isManagerStats,
} from "../api/dashboard-api";

const STALE = 60_000;

export const useDashboard = () => {
  const user = useAuthStore((s) => s.user);
  const isTechnician =
    (user?.roles.includes("TECHNICIAN") ?? false) &&
    !user?.roles.some((r) => r === "ADMIN" || r === "MANAGER");
  const userId = isTechnician ? user?.id : undefined;

  const isAuthenticated = !!user;
  const isManager = isAuthenticated && !isTechnician;

  const [
    dashboardStats,
    inventoryStats,
    lowStock,
    unreadCount,
    recentTasks,
    recentNotifications,
    overdueTasks,
    dueThisWeekTasks,
  ] = useQueries({
    queries: [
      {
        // user?.id in key ensures refetch on user switch (e.g. logout → login)
        queryKey: ["dashboard", "stats", user?.id],
        queryFn: getDashboardStats,
        staleTime: STALE,
        enabled: isAuthenticated,
      },
      {
        queryKey: ["dashboard", "inventoryStats"],
        queryFn: getInventoryStats,
        staleTime: STALE,
        enabled: isManager,
      },
      {
        queryKey: ["dashboard", "lowStock"],
        queryFn: getLowStockItems,
        staleTime: STALE,
        enabled: isManager,
      },
      {
        queryKey: ["dashboard", "unreadCount", user?.id],
        queryFn: getUnreadNotificationsCount,
        staleTime: STALE,
        enabled: isAuthenticated,
      },
      {
        // Key on user?.id (not userId, which is undefined for managers) so switching
        // between two manager accounts refetches instead of reusing cached data.
        queryKey: ["dashboard", "recentTasks", user?.id],
        queryFn: () => getRecentTasks(userId),
        staleTime: STALE,
        enabled: isAuthenticated,
      },
      {
        queryKey: ["dashboard", "recentNotifications", user?.id],
        queryFn: getRecentNotifications,
        staleTime: STALE,
        enabled: isAuthenticated,
      },
      {
        queryKey: ["dashboard", "overdueTasks", user?.id],
        queryFn: () => getOverdueTasks(userId),
        staleTime: STALE,
        enabled: isAuthenticated,
      },
      {
        queryKey: ["dashboard", "dueThisWeek", user?.id],
        queryFn: () => getDueThisWeekTasks(userId),
        staleTime: STALE,
        enabled: isAuthenticated,
      },
    ],
  });

  const statsData = dashboardStats.data;
  const managerStats = statsData && isManagerStats(statsData) ? statsData : null;
  const techStats = statsData && !isManagerStats(statsData) ? statsData : null;

  // Both shapes expose byStatus/overdue — pick the active one once instead of
  // coalescing manager vs technician on every field.
  const taskStats = managerStats?.tasks ?? techStats?.myTasks ?? null;
  const open = taskStats?.byStatus.OPEN ?? 0;
  const inProgress = taskStats?.byStatus.IN_PROGRESS ?? 0;
  const done = taskStats?.byStatus.DONE ?? 0;
  const overdueCount = taskStats?.overdue ?? 0;

  // Inventory queries only run for managers; the stats query runs for everyone.
  const inventoryIsLoading = isManager && (inventoryStats.isPending || lowStock.isPending);
  const isLoading =
    dashboardStats.isPending ||
    inventoryIsLoading ||
    unreadCount.isPending ||
    recentTasks.isPending ||
    recentNotifications.isPending ||
    overdueTasks.isPending ||
    dueThisWeekTasks.isPending;

  return {
    isLoading,
    // Surface stats failure so the page can show an error instead of fabricated zeros.
    isError: dashboardStats.isError,
    refetch: () => void dashboardStats.refetch(),
    isTechnician,
    stats: {
      totalItems: managerStats?.inventory.total ?? 0,
      lowStockCount: managerStats?.inventory.lowStock ?? 0,
      outOfStockCount: managerStats?.inventory.outOfStock ?? 0,
      activeTasks: open + inProgress,
      totalTasks: open + inProgress + done,
      overdueCount,
      activeSchedules: managerStats?.schedules.active ?? 0,
      schedulesThisWeek: managerStats?.schedules.dueThisWeek ?? 0,
    },
    taskStatusData: { open, inprogress: inProgress, done },
    lowStockItems: lowStock.data?.items ?? [],
    categoryBreakdown: inventoryStats.data?.byCategory ?? {},
    recentTasks: recentTasks.data ?? [],
    recentNotifications: recentNotifications.data ?? [],
    overdueTasks: overdueTasks.data ?? [],
    dueThisWeekTasks: dueThisWeekTasks.data ?? [],
    unreadCount: unreadCount.data ?? 0,
    technicians: managerStats?.technicians ?? [],
  };
};
