import axios, { AxiosError } from "axios";

import { isAccountDeactivatedError } from "@/shared/lib/api-error";
import { queryClient } from "@/shared/lib/query-client";
import { useAuthStore } from "@/shared/stores/auth-store";

declare module "axios" {
  interface InternalAxiosRequestConfig {
    isRetried?: boolean;
  }
}

const baseURL = import.meta.env.VITE_API_BASE_URL ?? "/api/v1";

export const axiosInstance = axios.create({ baseURL, withCredentials: true });

// Fired when the server refuses a request the signed-in user isn't allowed to make. The server reads
// roles from the database on each request, so the roles held here may be out of date.
export const ROLE_DENIED_EVENT = "api:role-denied";

// Shared across concurrent 401s so a burst of requests triggers one refresh
// call, not one per request — callers all await the same in-flight promise.
let refreshPromise: Promise<string> | null = null;

axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

async function refreshAccessToken(): Promise<string> {
  // Uses axiosInstance itself — safe because the response interceptor below
  // skips retry-on-401 for /auth/* endpoints, so a failed refresh can't recurse.
  refreshPromise ??= axiosInstance
    .post<{ success: true; data: { accessToken: string; roles: string[] } }>("/auth/refresh")
    .then((res) => res.data.data.accessToken)
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

// A deactivated user is rejected on every request, so many can fail together; sign out once.
let isSigningOut = false;

const signOutDeactivatedUser = () => {
  if (isSigningOut) return;

  useAuthStore.getState().clearSession();
  queryClient.clear();

  // Already on the login page (a failed refresh at startup): nothing to leave, and reloading it
  // would repeat the request. The flag stays off so a later sign-in on this page still works.
  if (window.location.pathname === "/login") return;

  isSigningOut = true;
  // A full navigation drops everything held in memory, and lets the login page say why.
  window.location.assign("/login?reason=deactivated");
};

axiosInstance.interceptors.response.use(undefined, async (error: AxiosError) => {
  const config = error.config;

  const isAuthEndpoint = config?.url?.startsWith("/auth/");

  // The login form shows this message itself; anything else, refresh included, signs out.
  const isLogin = config?.url === "/auth/login";

  if (!isLogin && isAccountDeactivatedError(error)) signOutDeactivatedUser();
  else if (!isLogin && error.response?.status === 403)
    window.dispatchEvent(new Event(ROLE_DENIED_EVENT));

  const canRetry =
    error.response?.status === 401 && !!config && !config.isRetried && !isAuthEndpoint;

  if (!canRetry) {
    throw error;
  }

  try {
    config.isRetried = true;

    const accessToken = await refreshAccessToken();

    useAuthStore.getState().setAccessToken(accessToken);

    return axiosInstance.request(config);
  } catch (refreshError) {
    useAuthStore.getState().clearSession();
    queryClient.clear();

    throw refreshError;
  }
});
