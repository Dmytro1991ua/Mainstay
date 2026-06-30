import { useMutation } from "@tanstack/react-query";

import { useAuthStore } from "@/shared/stores/auth-store";

import { logout } from "../api/auth-api";

export const useLogout = () => {
  const clearSession = useAuthStore((s) => s.clearSession);

  return useMutation({
    mutationFn: logout,
    onSettled: () => clearSession(),
  });
};
