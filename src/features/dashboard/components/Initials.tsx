import { getInitials } from "@/shared/utils";

export const Initials = ({ name }: { name: string }) => (
  <span
    title={name}
    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-semibold uppercase text-white"
  >
    {getInitials(name)}
  </span>
);
