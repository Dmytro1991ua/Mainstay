import type { OnSetTableState, TableUrlState } from "@/shared/ui/data-table";
import { PageShell } from "@/shared/ui/page-shell";

import { WorkOrderRequestsTable } from "./WorkOrderRequestsTable";

type WorkOrderRequestsPageProps = {
  tableState: TableUrlState;
  onSetTableState: OnSetTableState;
};

export const WorkOrderRequestsPage = ({
  tableState,
  onSetTableState,
}: WorkOrderRequestsPageProps) => (
  <PageShell title="Requests" subtitle="File maintenance requests and track their review">
    <WorkOrderRequestsTable tableState={tableState} onSetTableState={onSetTableState} />
  </PageShell>
);
