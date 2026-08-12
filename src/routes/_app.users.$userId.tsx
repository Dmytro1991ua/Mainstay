import { createFileRoute, Navigate } from "@tanstack/react-router";

import { UserDetailPage } from "@/features/users";
import { useAuthStore } from "@/shared/stores/auth-store";

const UserDetailRoute = () => {
  const roles = useAuthStore((s) => s.user?.roles ?? []);

  const { userId } = Route.useParams();

  const canView = roles.includes("ADMIN") || roles.includes("MANAGER");

  if (!canView) return <Navigate to="/dashboard" />;

  return <UserDetailPage userId={userId} />;
};

export const Route = createFileRoute("/_app/users/$userId")({
  component: UserDetailRoute,
});
