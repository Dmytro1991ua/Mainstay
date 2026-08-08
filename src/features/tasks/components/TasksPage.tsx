import { cn } from "@/shared/lib/utils";
import { useAuthStore } from "@/shared/stores/auth-store";
import { Alert } from "@/shared/ui/alert";
import type { OnSetTableState, TableUrlState } from "@/shared/ui/data-table";
import { PageShell } from "@/shared/ui/page-shell";

import { TASK_TABS, TECHNICIAN_TASK_NOTICE } from "../constants";
import { useTasksTab } from "../hooks/use-tasks-tab";

import { TasksTable } from "./TasksTable";

type TasksPageProps = {
  tableState: TableUrlState;
  onSetTableState: OnSetTableState;
};

export const TasksPage = ({ tableState, onSetTableState }: TasksPageProps) => {
  const roles = useAuthStore((s) => s.user?.roles ?? []);
  const isTech =
    roles.includes("TECHNICIAN") && !roles.some((r) => r === "ADMIN" || r === "MANAGER");

  const { activeTab, handleTabChange, myTasksOnly } = useTasksTab(onSetTableState, isTech);

  const tabControl = (
    <div className="inline-flex shrink-0 gap-0.5 rounded-[10px] border border-border-2 bg-panel p-1">
      {TASK_TABS.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          onClick={() => handleTabChange(key)}
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
      title="Tasks"
      subtitle="Track and manage maintenance work orders"
      toolbar={
        isTech ? (
          <div className="flex items-center gap-3">
            <Alert className="flex-1">{TECHNICIAN_TASK_NOTICE}</Alert>
            {tabControl}
          </div>
        ) : (
          tabControl
        )
      }
    >
      <TasksTable
        tableState={tableState}
        onSetTableState={onSetTableState}
        myTasksOnly={myTasksOnly}
      />
    </PageShell>
  );
};
