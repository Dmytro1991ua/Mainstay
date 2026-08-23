import { useState } from "react";

import { cn } from "@/shared/lib/utils";
import { PageShell } from "@/shared/ui/page-shell";

import { SCHEDULE_TABS } from "../config";
import { toIsActive } from "../utils";

import { RecurringTasksTable } from "./RecurringTasksTable";

import type { ActiveFilter } from "../types";

export const RecurringTasksPage = () => {
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("all");

  const tabControl = (
    <div className="inline-flex shrink-0 gap-0.5 rounded-[10px] border border-border-2 bg-panel p-1">
      {SCHEDULE_TABS.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          onClick={() => setActiveFilter(key)}
          className={cn(
            "rounded-[7px] px-3 py-1.5 text-[12.5px] font-medium transition-colors",
            activeFilter === key
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
      title="Maintenance Schedules"
      subtitle="Define recurring maintenance work orders that auto-generate on a fixed interval"
      toolbar={tabControl}
    >
      <RecurringTasksTable isActiveFilter={toIsActive(activeFilter)} />
    </PageShell>
  );
};
