import { useAssetsQuery } from "@/features/assets";
import { useAuthStore } from "@/shared/stores/auth-store";
import type { FilterConfig, TableUrlState } from "@/shared/ui/data-table";

import { TASK_FILTER_CONFIG } from "../config";
import { buildTaskParams } from "../utils";

import { useTasksQuery } from "./use-tasks";
import { useUsersList } from "./use-users-list";

export const useTasksData = (
  tableState: TableUrlState,
  activeTab: import("./use-tasks-tab").TaskTab = "all",
) => {
  const user = useAuthStore((s) => s.user);

  const canManage = user?.roles.some((r) => r === "ADMIN" || r === "MANAGER") ?? false;
  const canDelete = user?.roles.includes("ADMIN") ?? false;
  const isTechnician = !canManage && (user?.roles.includes("TECHNICIAN") ?? false);

  const baseParams = buildTaskParams(tableState);
  const queryParams = {
    ...baseParams,
    ...(activeTab === "mine" && user?.id ? { assignedTo: user.id } : {}),
    ...(activeTab === "overdue" ? { overdue: true as const } : {}),
  };

  const { data, isLoading, isError, refetch, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useTasksQuery(queryParams);

  const { data: usersData } = useUsersList();
  const users = usersData?.pages.flatMap((p) => p.data) ?? [];

  const { data: assetsData } = useAssetsQuery({ limit: 50, sortBy: "name", sortOrder: "asc" });
  const assets = assetsData?.pages.flatMap((p) => p.data) ?? [];

  const assigneeFilter: FilterConfig[] =
    activeTab !== "mine" && canManage && users.length > 0
      ? [
          {
            id: "assignedTo",
            label: "Assignee",
            type: "single",
            options: users.map((u) => ({ value: u.id, label: u.userName })),
          },
        ]
      : [];

  const assetFilter: FilterConfig[] =
    assets.length > 0
      ? [
          {
            id: "asset",
            label: "Asset",
            type: "single",
            options: assets.map((a) => ({ value: a.id, label: a.name })),
          },
        ]
      : [];

  const baseFilters =
    activeTab === "overdue"
      ? TASK_FILTER_CONFIG.filter((f) => f.id !== "overdue")
      : TASK_FILTER_CONFIG;

  const filterConfig: FilterConfig[] = [...baseFilters, ...assigneeFilter, ...assetFilter];
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
