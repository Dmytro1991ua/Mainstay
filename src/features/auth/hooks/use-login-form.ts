import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";

import { useFormState } from "@/shared/hooks/use-form-state";

import { loginSchema, type LoginFormValues } from "../types/schemas";

import { useLogin } from "./use-login";

const INITIAL_VALUES: LoginFormValues = { email: "", password: "" };

export const useLoginForm = () => {
  const navigate = useNavigate();
  const login = useLogin();

  const { formState: form, onReset } = useFormState<LoginFormValues>({
    initialValues: INITIAL_VALUES,
    resolver: zodResolver(loginSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = handleSubmit((values) => {
    login.mutate(values, {
      onSuccess: () => navigate({ to: "/" }),
    });
  });

  return {
    register,
    onSubmit,
    onReset,
    errors,
    isPending: login.isPending,
    isError: login.isError,
    error: login.error,
  };
};
