import { create } from "zustand";

import type { components } from "@/shared/types/api-generated";

// avatarUrl is returned by the server but not yet in the generated OpenAPI spec —
// augmented here until the spec is updated and types are regenerated.
export type User = components["schemas"]["User"] & { avatarUrl?: string | null };
type AuthStatus = "pending" | "authenticated" | "unauthenticated";

interface AuthState {
  status: AuthStatus;
  accessToken: string | null;
  user: User | null;
  setSession: (accessToken: string, user: User) => void;
  setAccessToken: (accessToken: string) => void;
  updateUser: (patch: Partial<User>) => void;
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
  updateUser: (patch) => set((s) => ({ user: s.user ? { ...s.user, ...patch } : null })),
  clearSession: () => set({ status: "unauthenticated", accessToken: null, user: null }),
}));
