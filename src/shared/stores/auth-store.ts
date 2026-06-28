import { create } from "zustand";

import type { components } from "@/shared/types/api-generated";

type User = components["schemas"]["User"];

type AuthStatus = "pending" | "authenticated" | "unauthenticated";

interface AuthState {
  status: AuthStatus;
  accessToken: string | null;
  user: User | null;
  setSession: (accessToken: string, user: User) => void;
  setAccessToken: (accessToken: string) => void;
  clearSession: () => void;
}

/**
 * Access token lives in memory only (never localStorage) — on reload the
 * refresh-token HttpOnly cookie is used to silently mint a new one via
 * features/auth's bootstrap hook, instead of persisting the token client-side.
 */
export const useAuthStore = create<AuthState>((set) => ({
  status: "pending",
  accessToken: null,
  user: null,
  setSession: (accessToken, user) => set({ status: "authenticated", accessToken, user }),
  setAccessToken: (accessToken) => set({ accessToken }),
  clearSession: () => set({ status: "unauthenticated", accessToken: null, user: null }),
}));
