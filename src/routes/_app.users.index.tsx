import { createFileRoute, Navigate } from "@tanstack/react-router";

import { UsersPage } from "@/features/users";
import { useAuthStore } from "@/shared/stores/auth-store";
import { validateTableSearch } from "@/shared/ui/data-table";
import type { OnSetTableState } from "@/shared/ui/data-table";

const UsersIndexRoute = () => {
  const roles = useAuthStore((s) => s.user?.roles ?? []);
  const navigate = Route.useNavigate();
  const tableState = Route.useSearch();

  const canView = roles.includes("ADMIN") || roles.includes("MANAGER");

  if (!canView) return <Navigate to="/dashboard" />;

  const onSetTableState: OnSetTableState = (updater) => navigate({ search: updater });

  return <UsersPage tableState={tableState} onSetTableState={onSetTableState} />;
};

export const Route = createFileRoute("/_app/users/")({
  validateSearch: validateTableSearch,
  component: UsersIndexRoute,
});
