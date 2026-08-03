import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { getApiErrorMessage } from "@/shared/lib/api-error";
import { useAuthStore } from "@/shared/stores/auth-store";
import { toast } from "@/shared/ui/toast";

import { signOutAllDevices } from "../api/settings-api";

export const useSignOutAllDevices = () => {
  const clearSession = useAuthStore((s) => s.clearSession);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: signOutAllDevices,
    onSuccess: () => {
      clearSession();
      navigate({ to: "/login" });
    },
    onError: (error) => {
      toast.error("Failed to sign out all devices", { description: getApiErrorMessage(error) });
    },
  });
};
