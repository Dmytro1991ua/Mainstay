import { useInfiniteQuery } from "@tanstack/react-query";

import type { PaginatedResponse } from "@/shared/hooks/use-crud";
import { axiosInstance } from "@/shared/lib/api-client";
import { useAuthStore } from "@/shared/stores/auth-store";
import type { components } from "@/shared/types/api-generated";

type User = components["schemas"]["User"];

const PAGE_SIZE = 20;
const DEFAULT_QUERY_STALE_TIME = 5 * 60 * 1000;

type UsersListFilters = {
  availableOnly?: boolean;
  /** For assignment pickers: the server rejects assigning work to an inactive user. */
  activeOnly?: boolean;
};

const fetchUsers = async (
  page: number,
  { availableOnly, activeOnly }: UsersListFilters,
): Promise<PaginatedResponse<User>> => {
  const res = await axiosInstance.get<PaginatedResponse<User>>("/users", {
    params: {
      page,
      limit: PAGE_SIZE,
      ...(availableOnly ? { available: true } : {}),
      ...(activeOnly ? { status: "ACTIVE" } : {}),
    },
  });

  return res.data;
};

export const useUsersList = ({
  availableOnly = false,
  activeOnly = false,
}: UsersListFilters = {}) => {
  const roles = useAuthStore((s) => s.user?.roles ?? []);

  const canFetch = roles.includes("ADMIN") || roles.includes("MANAGER");

  return useInfiniteQuery({
    queryKey: ["users", "list", { availableOnly, activeOnly }],
    queryFn: ({ pageParam }) => fetchUsers(pageParam, { availableOnly, activeOnly }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.page < lastPage.meta.pages ? lastPage.meta.page + 1 : undefined,
    enabled: canFetch,
    staleTime: DEFAULT_QUERY_STALE_TIME,
  });
};
