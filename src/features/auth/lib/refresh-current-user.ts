import { useAuthStore } from "@/shared/stores/auth-store";

import { getCurrentUser } from "../api/auth-api";

let lastRefreshAt = 0;
let isRefreshing = false;

const sameRoles = (a: string[], b: string[]): boolean =>
  a.length === b.length && a.every((role) => b.includes(role));

/**
 * Reloads the signed-in user so menus and permission checks follow a role change made elsewhere.
 * Skipped when a refresh is running or ran less than `minIntervalMs` ago. Returns true when the
 * roles changed.
 */
export const refreshCurrentUser = async (minIntervalMs: number): Promise<boolean> => {
  if (isRefreshing || Date.now() - lastRefreshAt < minIntervalMs) return false;

  isRefreshing = true;
  // Set before the request so a failing one isn't retried in a tight loop.
  lastRefreshAt = Date.now();

  try {
    const user = await getCurrentUser();
    const { user: current, updateUser } = useAuthStore.getState();

    updateUser(user);

    return !!current && !sameRoles(current.roles, user.roles);
  } catch {
    return false;
  } finally {
    isRefreshing = false;
  }
};
