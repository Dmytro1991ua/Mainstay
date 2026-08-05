import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { useFormState } from "@/shared/hooks/use-form-state";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { toast } from "@/shared/ui/toast";

import { resetPassword } from "../api/auth-api";
import { resetPasswordSchema, type ResetPasswordFormValues } from "../types/schemas";

const DEFAULTS: ResetPasswordFormValues = { newPassword: "", confirmPassword: "" };

export const useResetPassword = (token: string) => {
  const navigate = useNavigate();

  const { formState: form } = useFormState<ResetPasswordFormValues>({
    initialValues: DEFAULTS,
    resolver: zodResolver(resetPasswordSchema),
  });

  const mutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast.success("Password updated", {
        description: "You can now sign in with your new password.",
      });
      navigate({ to: "/login" });
    },
    onError: (error) => {
      toast.error("Failed to reset password", { description: getApiErrorMessage(error) });
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    mutation.mutate({ token, newPassword: values.newPassword });
  });

  return { form, onSubmit, isPending: mutation.isPending };
};
