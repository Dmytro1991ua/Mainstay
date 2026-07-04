import { createFileRoute, Navigate } from "@tanstack/react-router";

import { useAuthStore } from "@/shared/stores/auth-store";

const UsersPage = () => {
  const roles = useAuthStore((s) => s.user?.roles ?? []);
  const canView = roles.includes("ADMIN") || roles.includes("MANAGER");
  if (!canView) return <Navigate to="/dashboard" />;

  return <p className="text-sm text-text-2">Users — coming soon.</p>;
};

export const Route = createFileRoute("/_app/users")({
  component: UsersPage,
});
