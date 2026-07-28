import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { getApiErrorMessage } from "@/shared/lib/api-error";
import { toast } from "@/shared/ui/toast";

import { updateUserRoles } from "../api/users-api";

import type { UserRole } from "../api/users-api";

const USERS_KEY = ["users"];

export const useInlineRole = (userId: string, initialRole: UserRole) => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (newRole: UserRole) => updateUserRoles(userId, [newRole]),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: USERS_KEY }),
  });

  const [optimistic, setOptimistic] = useState<UserRole | null>(null);

  const current = optimistic ?? initialRole;

  const handleChange = async (newRole: string) => {
    setOptimistic(newRole as UserRole);
    try {
      await mutateAsync(newRole as UserRole);

      setOptimistic(null);
    } catch (error) {
      setOptimistic(null);

      toast.error("Failed to update role", { description: getApiErrorMessage(error) });
    }
  };

  return { current, isPending, handleChange };
};
