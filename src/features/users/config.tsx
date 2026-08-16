import { format, formatDistanceToNow } from "date-fns";
import { PowerIcon, PowerOff, RefreshCw, Trash2 } from "lucide-react";

import type { FilterConfig } from "@/shared/ui/data-table";
import type { DetailField } from "@/shared/ui/detail-shell";
import { formatUserName } from "@/shared/utils";

import { UserAvailabilityBadge } from "./components/UserAvailabilityBadge";
import { UserRoleBadge } from "./components/UserRoleBadge";
import { UserStatusBadge } from "./components/UserStatusBadge";

import type { User, UserRole } from "./api/users-api";
import type { LucideIcon } from "lucide-react";

export type DisplayStatus = "ACTIVE" | "INACTIVE" | "PENDING";
export type UserAvailability = "AVAILABLE" | "RESERVED" | "BUSY";

export const USERS_REFETCH_INTERVAL = 30_000;

export type UserTableRow = {
  id: string;
  email: string;
  role: UserRole;
  source: "user" | "invite";
  userName: string | null;
  displayStatus: DisplayStatus;
  availability: UserAvailability | null;
  isExpired?: boolean;
};

export type ActionKey = "resend" | "cancelInvite" | "deactivate" | "activate" | "delete";

export type ActionConfig = {
  key: ActionKey;
  icon: LucideIcon;
  title: string | ((row: UserTableRow) => string);
  srLabel: (row: UserTableRow) => string;
  hoverClass: string;
  show?: (row: UserTableRow, isAdmin: boolean) => boolean;
};

export const ROLE_BADGE_CONFIG: Record<UserRole, { label: string; classes: string }> = {
  ADMIN: { label: "Admin", classes: "text-accent bg-accent-soft border-accent-border" },
  MANAGER: { label: "Manager", classes: "text-amber bg-amber-soft border-amber-border" },
  TECHNICIAN: { label: "Technician", classes: "text-purple bg-purple-soft border-purple-border" },
};

export const STATUS_BADGE_CONFIG: Record<DisplayStatus, { label: string; classes: string }> = {
  ACTIVE: { label: "Active", classes: "text-green bg-green-soft border-green-border" },
  INACTIVE: { label: "Inactive", classes: "text-red bg-red-soft border-red-border" },
  PENDING: { label: "Pending", classes: "text-amber bg-amber-soft border-amber-border" },
};

export const AVAILABILITY_BADGE_CONFIG: Record<
  UserAvailability,
  { label: string; classes: string }
> = {
  AVAILABLE: { label: "Available", classes: "text-green bg-green-soft border-green-border" },
  RESERVED: { label: "Reserved", classes: "text-accent bg-accent-soft border-accent-border" },
  BUSY: { label: "Busy", classes: "text-red bg-red-soft border-red-border" },
};

export const ROLE_OPTIONS: { label: string; value: UserRole }[] = [
  { label: "Admin", value: "ADMIN" },
  { label: "Manager", value: "MANAGER" },
  { label: "Technician", value: "TECHNICIAN" },
];

export const USER_FILTER_CONFIG: FilterConfig[] = [
  { id: "role", label: "Role", type: "single", options: ROLE_OPTIONS },
  {
    id: "status",
    label: "Status",
    type: "single",
    options: [
      { label: "Active", value: "ACTIVE" },
      { label: "Inactive", value: "INACTIVE" },
      { label: "Pending", value: "PENDING" },
    ],
  },
  {
    id: "available",
    label: "Availability",
    type: "single",
    options: [{ label: "Available only", value: "true" }],
  },
];

export const INVITE_ACTIONS: ActionConfig[] = [
  {
    key: "resend",
    icon: RefreshCw,
    title: (row) => (row.isExpired ? "Resend invite" : "Resend invite email"),
    srLabel: (row) => `Resend invite to ${row.email}`,
    hoverClass: "hover:bg-panel-2 hover:text-accent",
  },
  {
    key: "cancelInvite",
    icon: Trash2,
    title: "Cancel invite",
    srLabel: (row) => `Cancel invite for ${row.email}`,
    hoverClass: "hover:bg-red-soft hover:text-red",
    show: (_, isAdmin) => isAdmin,
  },
];

export const USER_ACTIONS: ActionConfig[] = [
  {
    key: "deactivate",
    icon: PowerOff,
    title: "Deactivate user",
    srLabel: (row) => `Deactivate ${row.userName}`,
    hoverClass: "hover:bg-red-soft hover:text-red",
    show: (row) => row.displayStatus === "ACTIVE",
  },
  {
    key: "activate",
    icon: PowerIcon,
    title: "Activate user",
    srLabel: (row) => `Activate ${row.userName}`,
    hoverClass: "hover:bg-green-soft hover:text-green",
    show: (row) => row.displayStatus === "INACTIVE",
  },
  {
    key: "delete",
    icon: Trash2,
    title: "Delete user",
    srLabel: (row) => `Delete ${row.userName}`,
    hoverClass: "hover:bg-red-soft hover:text-red",
  },
];

export const getUserDetailFields = (user: User): DetailField[] => [
  { label: "Status", value: <UserStatusBadge status={user.status} /> },
  ...(user.roles.includes("TECHNICIAN")
    ? [{ label: "Availability", value: <UserAvailabilityBadge availability={user.availability} /> }]
    : []),
  {
    label: "Role",
    value: (
      <div className="flex flex-wrap gap-1.5">
        {user.roles.map((role) => (
          <UserRoleBadge key={role} role={role} />
        ))}
      </div>
    ),
  },
  {
    label: "Username",
    value: <span className="font-medium text-text">{formatUserName(user.userName)}</span>,
  },
  { label: "Email", value: <span className="text-text-2">{user.email}</span> },
  {
    label: "Joined",
    value: <span className="text-text-2">{format(new Date(user.createdAt), "MMM d, yyyy")}</span>,
  },
  {
    label: "Last updated",
    value: (
      <span className="text-text-2">
        {formatDistanceToNow(new Date(user.updatedAt), { addSuffix: true })}
      </span>
    ),
  },
];
