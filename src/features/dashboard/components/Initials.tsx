import { Avatar } from "@/shared/ui/avatar";
import { getInitials } from "@/shared/utils";

export const Initials = ({ name }: { name: string }) => (
  <Avatar
    initials={getInitials(name).toUpperCase()}
    title={name}
    className="size-7 bg-accent text-[10px] text-white"
  />
);
