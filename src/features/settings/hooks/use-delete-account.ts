import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { useAuthStore } from "@/shared/stores/auth-store";
import { toast } from "@/shared/ui/toast";

import { deleteAccount } from "../api/settings-api";

export const useDeleteAccount = () => {
  const clearSession = useAuthStore((s) => s.clearSession);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      toast.success("Account deleted", {
        description: "Your account has been permanently removed.",
      });
      clearSession();
      navigate({ to: "/login" });
    },
  });
};
