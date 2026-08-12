import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { useAuthStore } from "@/shared/stores/auth-store";
import { toast } from "@/shared/ui/toast";

import { deleteUser, getUser, updateUserStatus } from "../api/users-api";

import type { User } from "../api/users-api";

const USERS_KEY = ["users"];

export const useUserDetail = (userId: string) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((s) => s.user);

  const roles = currentUser?.roles ?? [];
  const isAdmin = roles.includes("ADMIN");
  const isOwnAccount = currentUser?.id === userId;
  const canManageUser = isAdmin && !isOwnAccount;

  const {
    data: user,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: [...USERS_KEY, userId],
    queryFn: () => getUser(userId),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_KEY });
      toast.success("User deleted");
    },
    onError: () => toast.error("Failed to delete user"),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "ACTIVE" | "INACTIVE" }) =>
      updateUserStatus(id, status),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: USERS_KEY });
      queryClient.invalidateQueries({ queryKey: [...USERS_KEY, userId] });
      const label = updated.status === "ACTIVE" ? "activated" : "deactivated";
      toast.success(`User ${label}`, { description: `${updated.userName} is now ${label}.` });
    },
    onError: () => toast.error("Failed to update user status"),
  });

  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [statusTarget, setStatusTarget] = useState<User | null>(null);

  const openDelete = () => {
    if (user) setDeleteTarget(user);
  };
  const closeDelete = () => setDeleteTarget(null);
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      closeDelete();
      navigate({ to: "/users" });
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const openDeactivate = () => {
    if (user) setStatusTarget(user);
  };
  const closeStatus = () => setStatusTarget(null);
  const confirmDeactivate = async () => {
    if (!statusTarget) return;

    await statusMutation.mutateAsync({ id: statusTarget.id, status: "INACTIVE" });
    closeStatus();
  };
  const handleActivate = async () => {
    if (!user) return;

    await statusMutation.mutateAsync({ id: user.id, status: "ACTIVE" });
  };

  return {
    user,
    isPending,
    isError,
    refetch,
    isAdmin,
    canManageUser,
    deleteTarget,
    openDelete,
    closeDelete,
    handleDelete,
    isDeleting: deleteMutation.isPending,
    statusTarget,
    openDeactivate,
    closeStatus,
    confirmDeactivate,
    handleActivate,
    isUpdatingStatus: statusMutation.isPending,
  };
};
