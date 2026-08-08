import { useState } from "react";

import type { OnSetTableState } from "@/shared/ui/data-table";

export type TaskTab = "all" | "mine";

export const useTasksTab = (onSetTableState: OnSetTableState, isTechnician = false) => {
  const [activeTab, setActiveTab] = useState<TaskTab>(isTechnician ? "mine" : "all");

  const handleTabChange = (tab: TaskTab) => {
    setActiveTab(tab);
    if (tab === "mine") {
      onSetTableState((prev) => ({
        ...prev,
        filters: { ...prev.filters, assignedTo: [] },
      }));
    }
  };

  return { activeTab, handleTabChange, myTasksOnly: activeTab === "mine" };
};
