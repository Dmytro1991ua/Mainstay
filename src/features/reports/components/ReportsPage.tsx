import { BarChart3 } from "lucide-react";
import { useState } from "react";

import { cn } from "@/shared/lib/utils";
import { useAuthStore } from "@/shared/stores/auth-store";
import type { OnSetTableState, TableUrlState } from "@/shared/ui/data-table";
import { EmptyState } from "@/shared/ui/empty-state";
import { PageShell } from "@/shared/ui/page-shell";

import { REPORT_TABS } from "../config";

import { AssetReliabilityReport } from "./AssetReliabilityReport";
import { ThroughputReport } from "./ThroughputReport";

import type { ReportTab } from "../types";

type ReportsPageProps = {
  tableState: TableUrlState;
  onSetTableState: OnSetTableState;
};

export const ReportsPage = ({ tableState, onSetTableState }: ReportsPageProps) => {
  const canView =
    useAuthStore((s) => s.user)?.roles.some((r) => r === "ADMIN" || r === "MANAGER") ?? false;

  const [activeTab, setActiveTab] = useState<ReportTab>("throughput");

  if (!canView) {
    return (
      <PageShell title="Reports" subtitle="Operational analytics across assets and tasks">
        <EmptyState
          icon={BarChart3}
          message="Managers only"
          description="Reports are available to admins and managers."
        />
      </PageShell>
    );
  }

  const tabControl = (
    <div className="inline-flex shrink-0 gap-0.5 rounded-[10px] border border-border-2 bg-panel p-1">
      {REPORT_TABS.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          onClick={() => setActiveTab(key)}
          className={cn(
            "rounded-[7px] px-3 py-1.5 text-[12.5px] font-medium transition-colors",
            activeTab === key
              ? "bg-accent text-white shadow-sm"
              : "text-text-2 hover:bg-panel-2 hover:text-text",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );

  return (
    <PageShell
      title="Reports"
      subtitle="Operational analytics across assets and tasks"
      variant={activeTab === "reliability" ? "card" : "plain"}
      toolbar={tabControl}
    >
      {activeTab === "throughput" ? (
        <ThroughputReport />
      ) : (
        <AssetReliabilityReport tableState={tableState} onSetTableState={onSetTableState} />
      )}
    </PageShell>
  );
};
