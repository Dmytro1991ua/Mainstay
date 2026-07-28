import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { getApiErrorMessage } from "@/shared/lib/api-error";
import { toast } from "@/shared/ui/toast";

import { cancelInvite } from "../api/users-api";

import type { UserTableRow } from "./use-users";

const USERS_KEY = ["users"];

export const useCancelInvite = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => cancelInvite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_KEY });
      toast.success("Invite cancelled");
    },
    onError: (error) =>
      toast.error("Failed to cancel invite", { description: getApiErrorMessage(error) }),
  });

  const [cancelTarget, setCancelTarget] = useState<UserTableRow | null>(null);

  const openCancel = (row: UserTableRow) => setCancelTarget(row);
  const closeDialog = () => setCancelTarget(null);

  const confirmCancel = async () => {
    if (!cancelTarget) return;

    await mutation.mutateAsync(cancelTarget.id, { onSuccess: closeDialog });
  };

  return {
    cancelTarget,
    openCancel,
    closeDialog,
    confirmCancel,
    isCancelling: mutation.isPending,
  };
};
