import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { useAuthStore } from "@/shared/stores/auth-store";

import { logout } from "../api/auth-api";

export const useLogout = () => {
  const clearSession = useAuthStore((s) => s.clearSession);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      clearSession();
      navigate({ to: "/login" });
    },
  });
};
