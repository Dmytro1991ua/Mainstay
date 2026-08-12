import { format, formatDistanceToNow } from "date-fns";

import type { DetailField } from "@/shared/ui/detail-shell";
import { formatUserName } from "@/shared/utils";

import { UserRoleBadge } from "./components/UserRoleBadge";
import { UserStatusBadge } from "./components/UserStatusBadge";

import type { User } from "./api/users-api";

export const getUserDetailFields = (user: User): DetailField[] => [
  {
    label: "Status",
    value: <UserStatusBadge status={user.status} />,
  },
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
  {
    label: "Email",
    value: <span className="text-text-2">{user.email}</span>,
  },
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
