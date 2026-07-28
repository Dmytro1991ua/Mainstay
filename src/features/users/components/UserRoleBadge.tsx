import { cn } from "@/shared/lib/utils";

import { ROLE_BADGE_CONFIG } from "../config";

import type { UserRole } from "../api/users-api";

export const UserRoleBadge = ({ role }: { role: UserRole }) => {
  const { label, classes } = ROLE_BADGE_CONFIG[role];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[7px] border px-2.5 py-1 text-[11.5px] font-semibold",
        classes,
      )}
    >
      {label}
    </span>
  );
};
