import { format } from "date-fns";

import type { TechnicianWorkloadRow } from "../api/reports.api";
import type { ColumnDef } from "@tanstack/react-table";

const METRIC_COLUMNS: { id: keyof TechnicianWorkloadRow; header: string }[] = [
  { id: "openTasks", header: "Open" },
  { id: "inProgressTasks", header: "In progress" },
  { id: "overdueTasks", header: "Overdue" },
  { id: "completedTasks", header: "Completed" },
];

export const useTechnicianWorkloadColumns = (): ColumnDef<TechnicianWorkloadRow>[] => {
  return [
    {
      id: "userName",
      accessorKey: "userName",
      header: "Technician",
      enableSorting: true,
      size: 240,
      cell: ({ row }) => (
        <div>
          <span className="font-medium">{row.original.userName}</span>
          <div className="text-xs text-text-3">{row.original.email}</div>
        </div>
      ),
    },
    ...METRIC_COLUMNS.map<ColumnDef<TechnicianWorkloadRow>>(({ id, header }) => ({
      id,
      accessorKey: id,
      header,
      enableSorting: true,
      size: 120,
      cell: ({ row }) => <span className="tabular-nums text-text-2">{row.original[id]}</span>,
    })),
    {
      id: "nextDueAt",
      accessorKey: "nextDueAt",
      header: "Next due",
      enableSorting: true,
      size: 140,
      cell: ({ row }) => (
        <span className="text-text-2">
          {row.original.nextDueAt ? format(new Date(row.original.nextDueAt), "MMM d, yyyy") : "—"}
        </span>
      ),
    },
  ];
};
