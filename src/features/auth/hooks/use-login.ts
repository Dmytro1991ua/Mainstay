import { useMutation } from "@tanstack/react-query";

import { useAuthStore } from "@/shared/stores/auth-store";

import { getCurrentUser, login } from "../api/auth-api";

import type { LoginFormValues } from "../types/schemas";

export const useLogin = () => {
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: async (input: LoginFormValues) => {
      const { accessToken } = await login(input);
      // store the token before fetching the profile so the request
      // interceptor has something to attach to the Authorization header
      setAccessToken(accessToken);

      const user = await getCurrentUser();

      setSession(accessToken, user);

      return user;
    },
  });
};
