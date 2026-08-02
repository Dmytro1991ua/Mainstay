import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/shared/stores/auth-store";
import type { TableUrlState } from "@/shared/ui/data-table";

import { getPendingInvites, getUsers } from "../api/users-api";
import { USERS_REFETCH_INTERVAL } from "../config";

import type { PendingInvite, User, UserRole } from "../api/users-api";
import type { DisplayStatus } from "../config";

export type UserTableRow = {
  id: string;
  email: string;
  role: UserRole;
  source: "user" | "invite";
  userName: string | null;
  displayStatus: DisplayStatus;
  isExpired?: boolean;
};

const USERS_KEY = "users";
const INVITES_KEY = ["users", "pending-invites"];

const getPrimaryRole = (roles: User["roles"]): UserRole => {
  if (roles.includes("ADMIN")) return "ADMIN";

  if (roles.includes("MANAGER")) return "MANAGER";

  return "TECHNICIAN";
};

export const useUsersData = (tableState: TableUrlState) => {
  const currentUser = useAuthStore((s) => s.user);
  const roles = currentUser?.roles ?? [];
  const isAdmin = roles.includes("ADMIN");
  const isManager = roles.includes("MANAGER");
  const canFetch = isAdmin || isManager;

  const roleFilter = tableState.filters?.["role"]?.[0] as UserRole | undefined;
  const statusFilter = tableState.filters?.["status"]?.[0] as DisplayStatus | undefined;

  const usersQuery = useInfiniteQuery({
    queryKey: [USERS_KEY, { role: roleFilter }],
    queryFn: ({ pageParam }) =>
      getUsers({
        limit: 25,
        sortBy: "userName",
        sortOrder: "asc",
        role: roleFilter,
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.page < lastPage.meta.pages ? lastPage.meta.page + 1 : undefined,
    enabled: canFetch,
    refetchInterval: USERS_REFETCH_INTERVAL,
  });

  const invitesQuery = useQuery({
    queryKey: INVITES_KEY,
    queryFn: getPendingInvites,
    enabled: isAdmin,
    refetchInterval: USERS_REFETCH_INTERVAL,
  });

  const userRows: UserTableRow[] = (usersQuery.data?.pages ?? [])
    .flatMap((p) => p.data)
    .map((u: User) => ({
      id: u.id,
      email: u.email,
      role: getPrimaryRole(u.roles),
      source: "user",
      userName: u.userName,
      displayStatus: u.status,
    }));

  const inviteRows: UserTableRow[] = (invitesQuery.data ?? []).map((inv: PendingInvite) => ({
    id: inv.id,
    email: inv.email,
    role: inv.role as UserRole,
    source: "invite",
    userName: null,
    displayStatus: "PENDING",
    isExpired: inv.isExpired,
  }));

  const allRows: UserTableRow[] = [...userRows, ...inviteRows];

  const search = tableState.search?.toLowerCase() ?? "";

  const rows = allRows.filter((row) => {
    if (statusFilter && row.displayStatus !== statusFilter) return false;

    if (search) {
      const name = (row.userName ?? "").toLowerCase();

      return name.includes(search) || row.email.toLowerCase().includes(search);
    }

    return true;
  });

  return {
    rows,
    isLoading: usersQuery.isLoading,
    isError: usersQuery.isError,
    refetch: usersQuery.refetch,
    hasNextPage: usersQuery.hasNextPage,
    fetchNextPage: usersQuery.fetchNextPage,
    isFetchingNextPage: usersQuery.isFetchingNextPage,
    isAdmin,
    currentUserId: currentUser?.id,
  };
};
