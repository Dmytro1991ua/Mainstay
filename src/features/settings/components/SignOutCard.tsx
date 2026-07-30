import { LogOut } from "lucide-react";

import { useLogout } from "@/features/auth";

import { SettingCard } from "./SettingCard";

export const SignOutCard = () => {
  const logout = useLogout();

  return (
    <SettingCard className="flex items-center justify-between">
      <div>
        <div className="text-[13.5px] font-semibold">Sign out</div>
        <div className="text-[12px] text-text-3">End your session and return to login</div>
      </div>
      <button
        onClick={() => logout.mutate()}
        disabled={logout.isPending}
        className="flex h-9 items-center gap-1.5 rounded-[9px] border border-red-border bg-red-soft px-3.5 text-[13px] font-semibold text-red transition-opacity hover:opacity-80 disabled:opacity-50"
      >
        <LogOut className="size-3.5" />
        {logout.isPending ? "Signing out…" : "Sign out"}
      </button>
    </SettingCard>
  );
};
