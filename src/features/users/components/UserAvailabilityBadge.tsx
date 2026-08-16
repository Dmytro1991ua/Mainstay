import { AVAILABILITY_BADGE_CONFIG } from "../config";

import type { UserAvailability } from "../config";

export const UserAvailabilityBadge = ({
  availability,
}: {
  availability: UserAvailability | null;
}) => {
  if (!availability) return null;
  const { label, classes } = AVAILABILITY_BADGE_CONFIG[availability];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11.5px] font-medium ${classes}`}
    >
      {label}
    </span>
  );
};
