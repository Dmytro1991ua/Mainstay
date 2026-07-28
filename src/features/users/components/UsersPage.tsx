import { useAuthStore } from "@/shared/stores/auth-store";
import { Alert } from "@/shared/ui/alert";
import type { OnSetTableState, TableUrlState } from "@/shared/ui/data-table";
import { PageShell } from "@/shared/ui/page-shell";

import { UsersTable } from "./UsersTable";

type UsersPageProps = {
  tableState: TableUrlState;
  onSetTableState: OnSetTableState;
};

export const UsersPage = ({ tableState, onSetTableState }: UsersPageProps) => {
  const roles = useAuthStore((s) => s.user?.roles ?? []);

  const isManagerOnly = roles.includes("MANAGER") && !roles.includes("ADMIN");

  return (
    <PageShell
      title="Users"
      subtitle="Manage team access and roles."
      alert={
        isManagerOnly ? <Alert variant="info">Only admins can change roles.</Alert> : undefined
      }
    >
      <UsersTable tableState={tableState} onSetTableState={onSetTableState} />
    </PageShell>
  );
};
