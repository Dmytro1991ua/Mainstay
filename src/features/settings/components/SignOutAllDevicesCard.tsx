import { MonitorX } from "lucide-react";
import { useState } from "react";

import { useIsDemoAccount } from "@/shared/hooks/use-is-demo-account";
import { ConfirmDialog } from "@/shared/ui/dialog";

import { useSignOutAllDevices } from "../hooks/use-sign-out-all-devices";

import { SettingCard } from "./SettingCard";

export const SignOutAllDevicesCard = () => {
  const [open, setOpen] = useState(false);
  const isDemo = useIsDemoAccount();
  const mutation = useSignOutAllDevices();

  return (
    <>
      <SettingCard className="flex-row items-center justify-between">
        <div>
          <div className="text-[13.5px] font-semibold">Sign out of all devices</div>
          <div className="text-[12px] text-text-3">Revoke all active sessions everywhere</div>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          disabled={isDemo || mutation.isPending}
          className="flex h-9 items-center gap-1.5 rounded-[9px] border border-red-border bg-red-soft px-3.5 text-[13px] font-semibold text-red transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <MonitorX className="size-3.5" />
          Sign out everywhere
        </button>
      </SettingCard>

      <ConfirmDialog
        open={open}
        title="Sign out of all devices?"
        description="All active sessions will be revoked, including this one. You'll need to sign in again."
        icon={<MonitorX className="size-5 text-red" />}
        confirmLabel={mutation.isPending ? "Signing out…" : "Sign out everywhere"}
        variant="destructive"
        onConfirm={() => mutation.mutate()}
        onClose={() => setOpen(false)}
      />
    </>
  );
};
