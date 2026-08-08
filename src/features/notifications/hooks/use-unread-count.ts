import { useQuery } from "@tanstack/react-query";

import { getUnreadNotificationsCount } from "@/features/dashboard/api/dashboard-api";

export const useUnreadCount = () => {
  const { data: count = 0 } = useQuery({
    queryKey: ["dashboard", "unreadCount"],
    queryFn: getUnreadNotificationsCount,
  });

  return { count, hasUnread: count > 0 };
};
