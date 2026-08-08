import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useInfiniteQueryList } from "@/shared/hooks/use-crud";
import type { PaginatedResponse } from "@/shared/hooks/use-crud";

import {
  deleteNotification,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../api/notifications-api";

import type { Notification, NotificationsParams } from "../api/notifications-api";
import type { InfiniteData } from "@tanstack/react-query";

const QUERY_KEY = "notifications";

const DASHBOARD_KEYS = [
  ["dashboard", "unreadCount"],
  ["dashboard", "recentNotifications"],
] as const;

export type UseNotificationsOptions = Omit<NotificationsParams, "page">;

const applyOptimistic = (
  queryClient: ReturnType<typeof useQueryClient>,
  updater: (n: Notification) => Notification,
) => {
  queryClient.setQueriesData<InfiniteData<PaginatedResponse<Notification>>>(
    { queryKey: [QUERY_KEY] },
    (old) => {
      if (!old) return old;
      return {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          data: page.data.map(updater),
        })),
      };
    },
  );
};

export const useNotifications = (params: UseNotificationsOptions = {}) => {
  const queryClient = useQueryClient();

  const fullParams: NotificationsParams = { page: 1, ...params };

  const query = useInfiniteQueryList<Notification, NotificationsParams>(
    QUERY_KEY,
    fullParams,
    getNotifications,
  );

  const notifications = query.data?.pages.flatMap((p) => p.data) ?? [];

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    DASHBOARD_KEYS.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
  };

  const markRead = useMutation({
    mutationFn: markNotificationRead,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY] });
      const prev = queryClient.getQueriesData({ queryKey: [QUERY_KEY] });
      applyOptimistic(queryClient, (n) => (n.id === id ? { ...n, isRead: true } : n));
      return { prev };
    },
    onError: (_, __, ctx) => {
      ctx?.prev.forEach(([key, data]) => queryClient.setQueryData(key, data));
    },
    onSettled: invalidate,
  });

  const markAll = useMutation({
    mutationFn: markAllNotificationsRead,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY] });
      const prev = queryClient.getQueriesData({ queryKey: [QUERY_KEY] });
      applyOptimistic(queryClient, (n) => ({ ...n, isRead: true }));
      return { prev };
    },
    onError: (_, __, ctx) => {
      ctx?.prev.forEach(([key, data]) => queryClient.setQueryData(key, data));
    },
    onSettled: invalidate,
  });

  const remove = useMutation({
    mutationFn: deleteNotification,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY] });
      const prev = queryClient.getQueriesData({ queryKey: [QUERY_KEY] });

      queryClient.setQueriesData<InfiniteData<PaginatedResponse<Notification>>>(
        { queryKey: [QUERY_KEY] },
        (old) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data.filter((n) => n.id !== id),
            })),
          };
        },
      );
      return { prev };
    },
    onError: (_, __, ctx) => {
      ctx?.prev.forEach(([key, data]) => queryClient.setQueryData(key, data));
    },
    onSettled: invalidate,
  });

  return {
    notifications,
    isLoading: query.isPending,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    markRead: markRead.mutate,
    markAll: markAll.mutate,
    deleteNotification: remove.mutate,
  };
};
