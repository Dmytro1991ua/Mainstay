import { Initials } from "./Initials";

import type { ManagerDashboardStats } from "../api/dashboard-api";

type Technician = ManagerDashboardStats["technicians"][number];

export const TechnicianWorkload = ({ technicians }: { technicians: Technician[] }) => {
  if (!technicians.length) {
    return <p className="py-8 text-center text-sm text-text-3">No technicians found.</p>;
  }

  return (
    <ul className="divide-y divide-border">
      {technicians.map((t) => (
        <li key={t.id} className="flex items-center gap-3 py-2.5">
          <Initials name={t.userName} />
          <span className="flex-1 text-sm font-medium text-text">{t.userName}</span>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-text-2">{t.openTasks} open</span>
            {t.overdueTasks > 0 && (
              <span className="rounded-md border border-amber-border bg-amber-soft px-1.5 py-px font-semibold text-amber">
                {t.overdueTasks} overdue
              </span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};
