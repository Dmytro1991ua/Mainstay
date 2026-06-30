import { useEffect } from "react";

import { useAuthStore } from "@/shared/stores/auth-store";

import { getCurrentUser, refresh } from "../api/auth-api";

/**
 * Runs once on app load. Exchanges the HttpOnly refresh cookie for a fresh
 * access token so a page reload doesn't force a re-login — the access token
 * itself is never persisted client-side, see shared/stores/auth-store.ts.
 */
export const useBootstrapAuth = () => {
  const status = useAuthStore((s) => s.status);

  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setSession = useAuthStore((s) => s.setSession);
  const clearSession = useAuthStore((s) => s.clearSession);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { accessToken } = await refresh();

        if (cancelled) return;

        setAccessToken(accessToken);

        const user = await getCurrentUser();

        if (cancelled) return;

        setSession(accessToken, user);
      } catch {
        if (!cancelled) clearSession();
      }
    })();

    return () => {
      cancelled = true;
    };
    // intentionally runs once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return status;
};
