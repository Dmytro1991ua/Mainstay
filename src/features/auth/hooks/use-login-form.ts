import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useRouter, useSearch } from "@tanstack/react-router";

import { useFormState } from "@/shared/hooks/use-form-state";

import { loginSchema, type LoginFormValues } from "../types/schemas";

import { useLogin } from "./use-login";

const INITIAL_VALUES: LoginFormValues = { email: "", password: "" };

export const useLoginForm = () => {
  const navigate = useNavigate();
  const router = useRouter();
  const login = useLogin();
  const { redirect } = useSearch({ from: "/_auth/login" });

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
      onSuccess: () => {
        if (redirect) {
          router.history.push(redirect);
        } else {
          navigate({ to: "/dashboard" });
        }
      },
    });
  });

  const fillDemo = (email: string, password: string) => {
    form.reset({ email, password });
  };

  return {
    register,
    onSubmit,
    onReset,
    errors,
    isPending: login.isPending,
    isError: login.isError,
    error: login.error,
    fillDemo,
  };
};
