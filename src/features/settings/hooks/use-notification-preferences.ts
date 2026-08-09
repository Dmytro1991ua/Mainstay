import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/shared/ui/toast";

import { getNotificationPreferences, updateNotificationPreferences } from "../api/settings-api";

import type { NotificationPreferences } from "../api/settings-api";

const QUERY_KEY = ["settings", "notificationPreferences"] as const;

const DEFAULT_PREFERENCES: NotificationPreferences = {
  LOW_STOCK: true,
  OUT_OF_STOCK: true,
  TASK_OVERDUE: true,
};

export const useNotificationPreferences = () => {
  const queryClient = useQueryClient();

  const { data: preferences, isPending } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getNotificationPreferences,
  });

  const { mutate: update } = useMutation({
    mutationFn: updateNotificationPreferences,
    onMutate: async (patch) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });
      const prev = queryClient.getQueryData<NotificationPreferences>(QUERY_KEY);
      queryClient.setQueryData<NotificationPreferences>(QUERY_KEY, (old) => ({
        ...(old ?? DEFAULT_PREFERENCES),
        ...patch,
      }));
      return { prev };
    },
    onSuccess: () => {
      toast.success("Preferences saved");
    },
    onError: (_, __, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(QUERY_KEY, ctx.prev);
      toast.error("Failed to save", {
        description: "Your change couldn't be saved. Please try again.",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });

  return {
    preferences: preferences ?? DEFAULT_PREFERENCES,
    isPending,
    update,
  };
};
