import { BarChart3 } from "lucide-react";

import { useAuthStore } from "@/shared/stores/auth-store";
import { EmptyState } from "@/shared/ui/empty-state";
import { PageShell } from "@/shared/ui/page-shell";

import { ThroughputReport } from "./ThroughputReport";

export const ReportsPage = () => {
  const canView =
    useAuthStore((s) => s.user)?.roles.some((r) => r === "ADMIN" || r === "MANAGER") ?? false;

  return (
    <PageShell
      title="Reports"
      subtitle="Operational analytics across assets and tasks"
      variant="plain"
    >
      {canView ? (
        <ThroughputReport />
      ) : (
        <EmptyState
          icon={BarChart3}
          message="Managers only"
          description="Reports are available to admins and managers."
        />
      )}
    </PageShell>
  );
};
