import axios, { AxiosError } from "axios";

import { queryClient } from "@/shared/lib/query-client";
import { useAuthStore } from "@/shared/stores/auth-store";

declare module "axios" {
  interface InternalAxiosRequestConfig {
    isRetried?: boolean;
  }
}

const baseURL = import.meta.env.VITE_API_BASE_URL ?? "/api/v1";

export const axiosInstance = axios.create({ baseURL, withCredentials: true });

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

axiosInstance.interceptors.response.use(undefined, async (error: AxiosError) => {
  const config = error.config;

  const isAuthEndpoint = config?.url?.startsWith("/auth/");
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
