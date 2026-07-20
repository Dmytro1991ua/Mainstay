import { useInfiniteQuery } from "@tanstack/react-query";

import type { PaginatedResponse } from "@/shared/hooks/use-crud";
import { axiosInstance } from "@/shared/lib/api-client";
import { useAuthStore } from "@/shared/stores/auth-store";
import type { components } from "@/shared/types/api-generated";

type User = components["schemas"]["User"];

const PAGE_SIZE = 20;
const DEFAULT_QUERY_STALE_TIME = 5 * 60 * 1000;

const fetchUsers = async (page: number): Promise<PaginatedResponse<User>> => {
  const res = await axiosInstance.get<PaginatedResponse<User>>("/users", {
    params: { page, limit: PAGE_SIZE },
  });

  return res.data;
};

export const useUsersList = () => {
  const roles = useAuthStore((s) => s.user?.roles ?? []);

  const canFetch = roles.includes("ADMIN") || roles.includes("MANAGER");

  return useInfiniteQuery({
    queryKey: ["users", "list"],
    queryFn: ({ pageParam }) => fetchUsers(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.page < lastPage.meta.pages ? lastPage.meta.page + 1 : undefined,
    enabled: canFetch,
    staleTime: DEFAULT_QUERY_STALE_TIME,
  });
};
