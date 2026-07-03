import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";

import { useFormState } from "@/shared/hooks/use-form-state";

import { registerSchema, type RegisterFormValues } from "../types/schemas";

import { useRegister } from "./use-register";

const INITIAL_VALUES: RegisterFormValues = {
  userName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const useRegisterForm = () => {
  const navigate = useNavigate();
  const registerAccount = useRegister();

  const { formState: form, onReset } = useFormState<RegisterFormValues>({
    initialValues: INITIAL_VALUES,
    resolver: zodResolver(registerSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = handleSubmit((values) => {
    registerAccount.mutate(values, {
      onSuccess: () => navigate({ to: "/" }),
    });
  });

  return {
    register,
    onSubmit,
    onReset,
    errors,
    isPending: registerAccount.isPending,
    isError: registerAccount.isError,
    error: registerAccount.error,
  };
};
