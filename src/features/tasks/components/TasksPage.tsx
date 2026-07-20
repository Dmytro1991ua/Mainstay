import { useAuthStore } from "@/shared/stores/auth-store";
import { Alert } from "@/shared/ui/alert";
import type { OnSetTableState, TableUrlState } from "@/shared/ui/data-table";
import { PageShell } from "@/shared/ui/page-shell";

import { TasksTable } from "./TasksTable";

type TasksPageProps = {
  tableState: TableUrlState;
  onSetTableState: OnSetTableState;
};

const TECH_ALERT = "You can only update status on tasks assigned to you.";

export const TasksPage = ({ tableState, onSetTableState }: TasksPageProps) => {
  const roles = useAuthStore((s) => s.user?.roles ?? []);
  const isTech =
    roles.includes("TECHNICIAN") && !roles.some((r) => r === "ADMIN" || r === "MANAGER");

  return (
    <PageShell
      title="Tasks"
      subtitle="Track and manage maintenance work orders"
      alert={isTech ? <Alert>{TECH_ALERT}</Alert> : undefined}
    >
      <TasksTable tableState={tableState} onSetTableState={onSetTableState} />
    </PageShell>
  );
};
