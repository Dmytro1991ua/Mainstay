import { Link } from "@tanstack/react-router";
import { format, formatDistanceToNow } from "date-fns";

import { TaskPriorityBadge } from "@/features/tasks/components/TaskPriorityBadge";
import type { DetailField } from "@/shared/ui/detail-shell";
import { Pill } from "@/shared/ui/pill";
import { formatEnumLabel } from "@/shared/utils";

import { WORK_ORDER_STATUS_PILL } from "./config";

import type { WorkOrderRequest } from "./api/work-order-requests.api";

const renderUser = (user: { userName: string; email: string }) => (
  <span className="text-text">
    {user.userName}
    <span className="ml-2 text-xs text-text-3">{user.email}</span>
  </span>
);

export const getWorkOrderRequestDetailFields = (request: WorkOrderRequest): DetailField[] => {
  const fields: DetailField[] = [
    { label: "Status", value: <Pill status={WORK_ORDER_STATUS_PILL[request.status]} /> },
    { label: "Priority", value: <TaskPriorityBadge priority={request.priority} /> },
    {
      label: "Category",
      value: request.category ? (
        <span className="text-text">{formatEnumLabel(request.category)}</span>
      ) : (
        <span className="text-text-3">—</span>
      ),
    },
    { label: "Requested by", value: renderUser(request.requester) },
    {
      label: "Asset",
      value: request.asset ? (
        <Link
          to="/assets/$assetId"
          params={{ assetId: request.asset.id }}
          className="text-sm font-medium text-accent hover:underline"
        >
          {request.asset.name}
          <span className="ml-2 font-mono text-xs font-normal text-text-3">
            {request.asset.serialNumber}
          </span>
        </Link>
      ) : (
        <span className="text-text-3">—</span>
      ),
    },
  ];

  if (request.reviewer) {
    fields.push({ label: "Reviewed by", value: renderUser(request.reviewer) });
  }

  if (request.reviewedAt) {
    fields.push({
      label: "Reviewed",
      value: (
        <span className="text-text-2">{format(new Date(request.reviewedAt), "MMM d, yyyy")}</span>
      ),
    });
  }

  if (request.status === "APPROVED" && request.taskId) {
    fields.push({
      label: "Task",
      value: (
        <Link
          to="/tasks/$taskId"
          params={{ taskId: request.taskId }}
          className="text-sm font-medium text-accent hover:underline"
        >
          View created task
        </Link>
      ),
    });
  }

  if (request.status === "REJECTED" && request.rejectionReason) {
    fields.push({
      label: "Rejection reason",
      value: <span className="text-sm text-text">{request.rejectionReason}</span>,
    });
  }

  fields.push(
    {
      label: "Requested",
      value: (
        <span className="text-text-2">{format(new Date(request.createdAt), "MMM d, yyyy")}</span>
      ),
    },
    {
      label: "Last updated",
      value: (
        <span className="text-text-2">
          {formatDistanceToNow(new Date(request.updatedAt), { addSuffix: true })}
        </span>
      ),
    },
  );

  if (request.description) {
    fields.push({
      label: "Description",
      value: <span className="whitespace-pre-wrap text-sm text-text">{request.description}</span>,
    });
  }

  return fields;
};
