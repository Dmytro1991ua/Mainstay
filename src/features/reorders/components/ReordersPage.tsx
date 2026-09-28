import { PackagePlus } from "lucide-react";

import { useAuthStore } from "@/shared/stores/auth-store";
import type { OnSetTableState, TableUrlState } from "@/shared/ui/data-table";
import { EmptyState } from "@/shared/ui/empty-state";
import { PageShell } from "@/shared/ui/page-shell";

import { ReordersTable } from "./ReordersTable";

type ReordersPageProps = {
  tableState: TableUrlState;
  onSetTableState: OnSetTableState;
};

const SUBTITLE = "Track and receive stock replenishment orders";

export const ReordersPage = ({ tableState, onSetTableState }: ReordersPageProps) => {
  const canView =
    useAuthStore((s) => s.user)?.roles.some((r) => r === "ADMIN" || r === "MANAGER") ?? false;

  if (!canView) {
    return (
      <PageShell title="Reorders" subtitle={SUBTITLE}>
        <EmptyState
          icon={PackagePlus}
          message="Managers only"
          description="Reorders are available to admins and managers."
        />
      </PageShell>
    );
  }

  return (
    <PageShell title="Reorders" subtitle={SUBTITLE}>
      <ReordersTable tableState={tableState} onSetTableState={onSetTableState} />
    </PageShell>
  );
};
