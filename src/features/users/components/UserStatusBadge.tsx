import { STATUS_BADGE_CONFIG } from "../config";

import type { User } from "../api/users-api";

export const UserStatusBadge = ({ status }: { status: User["status"] }) => {
  const cfg = STATUS_BADGE_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11.5px] font-medium ${cfg.classes}`}
    >
      {cfg.label}
    </span>
  );
};
