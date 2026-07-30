import { Avatar } from "@/shared/ui/avatar";
import { formatUserName, getInitials } from "@/shared/utils";

type UserAvatarCellProps = {
  userName: string | null;
  email: string;
  isMe?: boolean;
};

export const UserAvatarCell = ({ userName, email, isMe }: UserAvatarCellProps) => {
  const initials = userName
    ? getInitials(formatUserName(userName)).toUpperCase()
    : email[0].toUpperCase();

  return (
    <div className="flex items-center gap-2.75">
      <Avatar initials={initials} className="size-8 text-[12px]" />
      <div className="flex items-center gap-1.5">
        {userName ? (
          <span className="text-[13.5px] font-medium text-text">{formatUserName(userName)}</span>
        ) : (
          <span className="text-[13px] italic text-text-3">Pending invite</span>
        )}
        {isMe && <span className="text-[11px] text-text-3">You</span>}
      </div>
    </div>
  );
};
