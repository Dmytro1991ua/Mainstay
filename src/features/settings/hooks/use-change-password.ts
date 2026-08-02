import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";

import { getApiErrorMessage } from "@/shared/lib/api-error";
import { useAuthStore } from "@/shared/stores/auth-store";
import { toast } from "@/shared/ui/toast";

import { changePassword } from "../api/settings-api";
import { changePasswordSchema, type ChangePasswordFormValues } from "../validation";

export type { ChangePasswordFormValues };

export const useChangePassword = () => {
  const navigate = useNavigate();

  const clearSession = useAuthStore((s) => s.clearSession);

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const mutation = useMutation({
    mutationFn: (values: ChangePasswordFormValues) =>
      changePassword({ currentPassword: values.currentPassword, newPassword: values.newPassword }),
    onSuccess: () => {
      toast.success("Password changed", {
        description: "All active sessions have been signed out.",
      });
      clearSession();
      navigate({ to: "/login" });
    },
    onError: (error) => {
      toast.error("Failed to change password", { description: getApiErrorMessage(error) });
    },
  });

  return {
    form,
    onSubmit: form.handleSubmit((values) => mutation.mutate(values)),
    isPending: mutation.isPending,
  };
};
