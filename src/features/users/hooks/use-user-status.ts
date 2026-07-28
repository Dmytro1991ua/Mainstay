import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { toast } from "@/shared/ui/toast";

import { updateUserStatus } from "../api/users-api";

import type { UserTableRow } from "./use-users";

const USERS_KEY = ["users"];

export const useUserStatus = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "ACTIVE" | "INACTIVE" }) =>
      updateUserStatus(id, status),
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: USERS_KEY });

      const label = user.status === "ACTIVE" ? "activated" : "deactivated";

      toast.success(`User ${label}`, { description: `${user.userName} is now ${label}.` });
    },
    onError: () => toast.error("Failed to update user status"),
  });

  const [deactivateTarget, setDeactivateTarget] = useState<UserTableRow | null>(null);

  const openDeactivate = (row: UserTableRow) => setDeactivateTarget(row);
  const closeDialog = () => setDeactivateTarget(null);

  const handleActivate = (row: UserTableRow) => {
    mutation.mutate({ id: row.id, status: "ACTIVE" });
  };

  const confirmDeactivate = async () => {
    if (!deactivateTarget) return;

    await mutation.mutateAsync(
      { id: deactivateTarget.id, status: "INACTIVE" },
      { onSuccess: closeDialog },
    );
  };

  return {
    deactivateTarget,
    openDeactivate,
    closeDialog,
    handleActivate,
    confirmDeactivate,
    isUpdating: mutation.isPending,
  };
};
