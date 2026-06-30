import { useMutation } from "@tanstack/react-query";

import { useAuthStore } from "@/shared/stores/auth-store";

import { getCurrentUser, login, register } from "../api/auth-api";

import type { RegisterFormValues } from "../types/schemas";

export const useRegister = () => {
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: async (input: RegisterFormValues) => {
      await register({ userName: input.userName, email: input.email, password: input.password });

      const { accessToken } = await login({ email: input.email, password: input.password });

      setAccessToken(accessToken);

      const user = await getCurrentUser();

      setSession(accessToken, user);

      return user;
    },
  });
};
