import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import { useFormState } from "@/shared/hooks/use-form-state";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { toast } from "@/shared/ui/toast";

import { acceptInvite } from "../api/auth-api";
import { acceptInviteSchema, type AcceptInviteFormValues } from "../types/schemas";

const DEFAULTS: AcceptInviteFormValues = { userName: "", password: "", confirmPassword: "" };

export const useAcceptInvite = (token: string) => {
  const mutation = useMutation({ mutationFn: acceptInvite });

  const { formState: form } = useFormState<AcceptInviteFormValues>({
    initialValues: DEFAULTS,
    resolver: zodResolver(acceptInviteSchema),
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync({ token, userName: values.userName, password: values.password });
    } catch (error) {
      toast.error("Failed to create account", { description: getApiErrorMessage(error) });
    }
  });

  return {
    form,
    onSubmit,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
};
