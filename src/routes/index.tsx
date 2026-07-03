import { createFileRoute, Navigate } from "@tanstack/react-router";

import { useAuthStore } from "@/shared/stores/auth-store";

const IndexRedirect = () => {
  const status = useAuthStore((s) => s.status);

  return <Navigate to={status === "authenticated" ? "/dashboard" : "/login"} />;
};

export const Route = createFileRoute("/")({
  component: IndexRedirect,
});
