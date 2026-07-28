import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { toast } from "@/shared/ui/toast";

import { deleteUser } from "../api/users-api";

import type { UserTableRow } from "./use-users";

const USERS_KEY = ["users"];

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_KEY });
      toast.success("User deleted");
    },
    onError: () => toast.error("Failed to delete user"),
  });

  const [deleteTarget, setDeleteTarget] = useState<UserTableRow | null>(null);

  const openDelete = (row: UserTableRow) => setDeleteTarget(row);
  const closeDialog = () => setDeleteTarget(null);

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    await mutation.mutateAsync(deleteTarget.id, { onSuccess: closeDialog });
  };

  return {
    deleteTarget,
    openDelete,
    closeDialog,
    confirmDelete,
    isDeleting: mutation.isPending,
  };
};
