import { QueryClient } from "@tanstack/react-query";

const QUERY_CLIENT_RETRY_VALUE = 1;
const QUERY_CLIENT_STALE_TIME = 30000;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: QUERY_CLIENT_RETRY_VALUE,
      refetchOnWindowFocus: false,
      staleTime: QUERY_CLIENT_STALE_TIME,
    },
  },
});
