import { useMutation } from "@tanstack/react-query";

import { getApiErrorMessage } from "@/shared/lib/api-error";
import { useAuthStore } from "@/shared/stores/auth-store";
import { toast } from "@/shared/ui/toast";

import { uploadAvatar } from "../api/settings-api";

export const useUploadAvatar = () => {
  const updateUser = useAuthStore((s) => s.updateUser);

  return useMutation({
    mutationFn: uploadAvatar,
    onSuccess: (user) => {
      updateUser({ avatarUrl: user.avatarUrl });
      toast.success("Avatar updated");
    },
    onError: (error) => {
      toast.error("Failed to upload avatar", { description: getApiErrorMessage(error) });
    },
  });
};
