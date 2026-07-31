import { useAuthStore } from "@/shared/stores/auth-store";
import { formatUserName, getInitials } from "@/shared/utils";

import { ROLE_LABEL } from "../config";

import { AvatarDropzone } from "./AvatarDropzone";
import { SettingCard } from "./SettingCard";

export const ProfileCard = () => {
  const user = useAuthStore((s) => s.user);

  if (!user) return null;

  const displayName = formatUserName(user.userName);
  const initials = getInitials(displayName);

  const role = user.roles[0];

  return (
    <SettingCard>
      <h3 className="mb-4 text-[14px] font-semibold">Profile</h3>
      <div className="flex items-center gap-3.5">
        <AvatarDropzone initials={initials} />
        <div>
          <div className="text-[15px] font-semibold">{displayName}</div>
          <div className="text-[13px] text-text-2">{user.email}</div>
        </div>
        <div className="flex-1" />
        <span className="rounded-lg border border-accent-border bg-accent-soft px-2.5 py-1 text-[12px] font-semibold text-accent">
          {ROLE_LABEL[role] ?? role}
        </span>
      </div>
    </SettingCard>
  );
};
