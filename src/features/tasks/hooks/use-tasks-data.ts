import { useAuthStore } from "@/shared/stores/auth-store";
import type { FilterConfig, TableUrlState } from "@/shared/ui/data-table";

import { TASK_FILTER_CONFIG } from "../config";
import { buildTaskParams } from "../utils";

import { useTasksQuery } from "./use-tasks";
import { useUsersList } from "./use-users-list";

export const useTasksData = (tableState: TableUrlState, myTasksOnly = false) => {
  const user = useAuthStore((s) => s.user);

  const canManage = user?.roles.some((r) => r === "ADMIN" || r === "MANAGER") ?? false;
  const canDelete = user?.roles.includes("ADMIN") ?? false;
  const isTechnician = !canManage && (user?.roles.includes("TECHNICIAN") ?? false);

  const baseParams = buildTaskParams(tableState);
  const queryParams = myTasksOnly && user?.id ? { ...baseParams, assignedTo: user.id } : baseParams;

  const { data, isLoading, isError, refetch, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useTasksQuery(queryParams);

  const { data: usersData } = useUsersList();
  const users = usersData?.pages.flatMap((p) => p.data) ?? [];

  const assigneeFilter: FilterConfig[] =
    canManage && users.length > 0
      ? [
          {
            id: "assignedTo",
            label: "Assignee",
            type: "single",
            options: users.map((u) => ({ value: u.id, label: u.userName })),
          },
        ]
      : [];

  const filterConfig: FilterConfig[] = myTasksOnly
    ? TASK_FILTER_CONFIG
    : [...TASK_FILTER_CONFIG, ...assigneeFilter];
  const tasks = data?.pages.flatMap((p) => p.data) ?? [];

  return {
    tasks,
    isLoading,
    isError,
    refetch,
    canManage,
    canDelete,
    isTechnician,
    currentUserId: user?.id,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    filterConfig,
  };
};
