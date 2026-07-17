import { useAuthStore } from "@/shared/stores/auth-store";
import { Alert } from "@/shared/ui/alert";
import type { OnSetTableState, TableUrlState } from "@/shared/ui/data-table";
import { PageShell } from "@/shared/ui/page-shell";

import { InventoryTable } from "./InventoryTable";

type InventoryPageProps = {
  tableState: TableUrlState;
  onSetTableState: OnSetTableState;
};

const ALERT_MESSAGE = "Read-only — inventory edits require a manager or admin.";

export const InventoryPage = ({ tableState, onSetTableState }: InventoryPageProps) => {
  const canManage = useAuthStore((s) => s.user)?.roles.some(
    (r) => r === "ADMIN" || r === "MANAGER",
  );

  const renderAlert = <>{!canManage ? <Alert>{ALERT_MESSAGE}</Alert> : null}</>;

  return (
    <PageShell
      title="Inventory"
      subtitle="Track and manage equipment and supplies"
      alert={renderAlert}
    >
      <InventoryTable tableState={tableState} onSetTableState={onSetTableState} />
    </PageShell>
  );
};
