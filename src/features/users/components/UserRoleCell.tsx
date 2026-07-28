import { InlineRoleSelect } from "./InlineRoleSelect";
import { UserRoleBadge } from "./UserRoleBadge";

import type { UserRole } from "../api/users-api";

type UserRoleCellProps = {
  userId: string;
  role: UserRole;
  editable: boolean;
};

export const UserRoleCell = ({ userId, role, editable }: UserRoleCellProps) => {
  if (!editable) return <UserRoleBadge role={role} />;

  return <InlineRoleSelect userId={userId} role={role} />;
};
