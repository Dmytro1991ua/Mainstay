import { format } from "date-fns";

import { TaskPriorityBadge } from "@/features/tasks/components/TaskPriorityBadge";
import { Pill } from "@/shared/ui/pill";
import { formatEnumLabel } from "@/shared/utils";

import { WORK_ORDER_STATUS_PILL } from "../config";

import type { WorkOrderRequest } from "../api/work-order-requests.api";
import type { ColumnDef } from "@tanstack/react-table";

export const useWorkOrderRequestColumns = (): ColumnDef<WorkOrderRequest>[] => {
  return [
    {
      id: "title",
      accessorKey: "title",
      header: "Request",
      enableSorting: false,
      size: 280,
      cell: ({ row }) => <span className="font-medium">{row.original.title}</span>,
    },
    {
      id: "requester",
      header: "Requested by",
      enableSorting: false,
      size: 200,
      cell: ({ row }) => (
        <div>
          <span className="text-text-2">{row.original.requester.userName}</span>
          <div className="text-xs text-text-3">{row.original.requester.email}</div>
        </div>
      ),
    },
    {
      id: "category",
      accessorKey: "category",
      header: "Category",
      enableSorting: false,
      size: 150,
      cell: ({ row }) =>
        row.original.category ? (
          <span className="text-text-2">{formatEnumLabel(row.original.category)}</span>
        ) : (
          <span className="text-text-3">—</span>
        ),
    },
    {
      id: "priority",
      accessorKey: "priority",
      header: "Priority",
      enableSorting: true,
      size: 110,
      cell: ({ row }) => <TaskPriorityBadge priority={row.original.priority} />,
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      enableSorting: true,
      size: 130,
      cell: ({ row }) => <Pill status={WORK_ORDER_STATUS_PILL[row.original.status]} />,
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: "Requested",
      enableSorting: true,
      size: 140,
      cell: ({ row }) => (
        <span className="text-text-2">
          {format(new Date(row.original.createdAt), "MMM d, yyyy")}
        </span>
      ),
    },
  ];
};
