import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import { useFormState } from "@/shared/hooks/use-form-state";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { toast } from "@/shared/ui/toast";

import { forgotPassword } from "../api/auth-api";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "../types/schemas";

const DEFAULTS: ForgotPasswordFormValues = { email: "" };

export const useForgotPassword = () => {
  const mutation = useMutation({ mutationFn: forgotPassword });

  const { formState: form } = useFormState<ForgotPasswordFormValues>({
    initialValues: DEFAULTS,
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync(values);
    } catch (error) {
      toast.error("Something went wrong", { description: getApiErrorMessage(error) });
    }
  });

  return {
    form,
    onSubmit,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
  };
};
