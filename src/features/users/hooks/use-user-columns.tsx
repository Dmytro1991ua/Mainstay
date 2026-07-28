import { PowerIcon, PowerOff, RefreshCw, Trash2 } from "lucide-react";

import { Checkbox } from "@/shared/ui/checkbox";
import { DataTableCheckbox } from "@/shared/ui/data-table/data-table-checkbox";

import { UserAvatarCell } from "../components/UserAvatarCell";
import { UserRoleCell } from "../components/UserRoleCell";
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

const commonBtnStyles =
  "invisible flex size-7 items-center justify-center rounded-lg text-text-3 transition-colors group-hover:visible";

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
    cell: ({ row }) => {
      const r = row.original;

      if (r.source === "invite") {
        return (
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onResendInvite(r);
              }}
              title={r.isExpired ? "Resend invite" : "Resend invite email"}
              className={`${commonBtnStyles} hover:bg-panel-2 hover:text-accent`}
            >
              <RefreshCw className="size-3.5" />
              <span className="sr-only">Resend invite to {r.email}</span>
            </button>
            {isAdmin && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCancelInvite(r);
                }}
                title="Cancel invite"
                className={`${commonBtnStyles} hover:bg-red-soft hover:text-red`}
              >
                <Trash2 className="size-3.5" />
                <span className="sr-only">Cancel invite for {r.email}</span>
              </button>
            )}
          </div>
        );
      }

      if (!isAdmin || r.id === currentUserId) return null;

      return (
        <div className="flex items-center justify-end gap-1">
          {r.displayStatus === "ACTIVE" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeactivate(r);
              }}
              title="Deactivate user"
              className={`${commonBtnStyles} hover:bg-red-soft hover:text-red`}
            >
              <PowerOff className="size-3.5" />
              <span className="sr-only">Deactivate {r.userName}</span>
            </button>
          )}
          {r.displayStatus === "INACTIVE" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onActivate(r);
              }}
              title="Activate user"
              className={`${commonBtnStyles} hover:bg-green-soft hover:text-green`}
            >
              <PowerIcon className="size-3.5" />
              <span className="sr-only">Activate {r.userName}</span>
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(r);
            }}
            title="Delete user"
            className={`${commonBtnStyles} hover:bg-red-soft hover:text-red`}
          >
            <Trash2 className="size-3.5" />
            <span className="sr-only">Delete {r.userName}</span>
          </button>
        </div>
      );
    },
  },
];
