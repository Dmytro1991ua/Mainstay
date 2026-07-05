import { useAuthStore } from "@/shared/stores/auth-store";

import { getCurrentUser, refresh } from "../api/auth-api";

// Memoized promise — resolved on the first call, returned as-is on every
// subsequent navigation so beforeLoad has zero cost after initial bootstrap.
let bootstrapPromise: Promise<void> | null = null;

export const bootstrapAuth = (): Promise<void> => {
  if (bootstrapPromise !== null) return bootstrapPromise;

  bootstrapPromise = (async () => {
    try {
      const { accessToken } = await refresh();
      useAuthStore.getState().setAccessToken(accessToken);
      const user = await getCurrentUser();
      useAuthStore.getState().setSession(accessToken, user);
    } catch {
      useAuthStore.getState().clearSession();
    }
  })();

  return bootstrapPromise;
};
