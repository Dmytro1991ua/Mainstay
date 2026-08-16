import { Checkbox } from "@/shared/ui/checkbox";
import { DataTableCheckbox } from "@/shared/ui/data-table/data-table-checkbox";

import { UserAvailabilityBadge } from "../components/UserAvailabilityBadge";
import { UserAvatarCell } from "../components/UserAvatarCell";
import { UserRoleCell } from "../components/UserRoleCell";
import { UserRowActions } from "../components/UserRowActions";
import { STATUS_BADGE_CONFIG } from "../config";

import type { UserTableRow } from "./use-users";
import type { ColumnDef } from "@tanstack/react-table";

type UseUserColumnsOptions = {
  isAdmin: boolean;
  currentUserId?: string;
  onDeactivate: (row: UserTableRow) => void;
  onActivate: (row: UserTableRow) => void;
  onDelete: (row: UserTableRow) => void;
  onResendInvite: (row: UserTableRow) => void;
  onCancelInvite: (row: UserTableRow) => void;
};

export const useUserColumns = ({
  isAdmin,
  currentUserId,
  onDeactivate,
  onActivate,
  onDelete,
  onResendInvite,
  onCancelInvite,
}: UseUserColumnsOptions): ColumnDef<UserTableRow>[] => [
  {
    id: "select",
    header: ({ table }) => <DataTableCheckbox table={table} />,
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onClick={(e) => {
          e.stopPropagation();
          row.toggleSelected(!row.getIsSelected());
        }}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableResizing: false,
    size: 40,
  },
  {
    id: "user",
    header: "User",
    enableSorting: false,
    size: 280,
    cell: ({ row }) => (
      <UserAvatarCell
        userName={row.original.userName}
        email={row.original.email}
        isMe={row.original.id === currentUserId}
      />
    ),
  },
  {
    id: "email",
    accessorKey: "email",
    header: "Email",
    enableSorting: false,
    size: 240,
    cell: ({ row }) => <span className="text-[13px] text-text-2">{row.original.email}</span>,
  },
  {
    id: "role",
    header: "Role",
    enableSorting: false,
    size: 150,
    cell: ({ row }) => {
      const r = row.original;
      return (
        <UserRoleCell
          userId={r.id}
          role={r.role}
          editable={isAdmin && r.source === "user" && r.id !== currentUserId}
        />
      );
    },
  },
  {
    id: "availability",
    header: "Availability",
    enableSorting: false,
    size: 130,
    cell: ({ row }) => {
      const r = row.original;

      if (r.source !== "user" || r.role !== "TECHNICIAN") return null;

      return <UserAvailabilityBadge availability={r.availability} />;
    },
  },
  {
    id: "status",
    header: "Status",
    enableSorting: false,
    size: 110,
    cell: ({ row }) => {
      const r = row.original;
      const cfg = STATUS_BADGE_CONFIG[r.displayStatus];
      const isExpiredPending = r.source === "invite" && r.isExpired;
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11.5px] font-medium ${cfg.classes} ${isExpiredPending ? "opacity-60" : ""}`}
        >
          {isExpiredPending ? "Expired" : cfg.label}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "",
    enableSorting: false,
    size: 80,
    cell: ({ row }) => (
      <UserRowActions
        row={row.original}
        isAdmin={isAdmin}
        currentUserId={currentUserId}
        onDeactivate={onDeactivate}
        onActivate={onActivate}
        onDelete={onDelete}
        onResendInvite={onResendInvite}
        onCancelInvite={onCancelInvite}
      />
    ),
  },
];
