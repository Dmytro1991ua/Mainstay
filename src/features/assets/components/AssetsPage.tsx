import { useAuthStore } from "@/shared/stores/auth-store";
import { Alert } from "@/shared/ui/alert";
import type { OnSetTableState, TableUrlState } from "@/shared/ui/data-table";
import { PageShell } from "@/shared/ui/page-shell";

import { AssetsTable } from "./AssetsTable";
import { AssetStats } from "./AssetStats";

type AssetsPageProps = {
  tableState: TableUrlState;
  onSetTableState: OnSetTableState;
};

const ALERT_MESSAGE = "Read-only — asset edits require a manager or admin.";

export const AssetsPage = ({ tableState, onSetTableState }: AssetsPageProps) => {
  const canManage = useAuthStore((s) => s.user)?.roles.some(
    (r) => r === "ADMIN" || r === "MANAGER",
  );

  const renderAlert = <>{!canManage ? <Alert>{ALERT_MESSAGE}</Alert> : null}</>;

  return (
    <PageShell
      title="Assets"
      subtitle="Track equipment and its maintenance history"
      alert={renderAlert}
      toolbar={<AssetStats />}
    >
      <AssetsTable tableState={tableState} onSetTableState={onSetTableState} />
    </PageShell>
  );
};
