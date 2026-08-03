import { Trash2 } from "lucide-react";
import { useState } from "react";

import { useIsDemoAccount } from "@/shared/hooks/use-is-demo-account";
import { ConfirmDialog } from "@/shared/ui/dialog";

import { useDeleteAccount } from "../hooks/use-delete-account";

import { SettingCard } from "./SettingCard";

export const DeleteAccountCard = () => {
  const isDemo = useIsDemoAccount();
  const mutation = useDeleteAccount();

  const [open, setOpen] = useState(false);

  return (
    <>
      <SettingCard className="flex-row items-center justify-between">
        <div>
          <div className="text-[13.5px] font-semibold">Delete account</div>
          <div className="text-[12px] text-text-3">
            Permanently remove your account and all data
          </div>
        </div>
        <button
          onClick={() => setOpen(true)}
          disabled={isDemo || mutation.isPending}
          className="flex h-9 items-center gap-1.5 rounded-[9px] border border-red-border bg-red-soft px-3.5 text-[13px] font-semibold text-red transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash2 className="size-3.5" />
          Delete account
        </button>
      </SettingCard>

      <ConfirmDialog
        open={open}
        title="Delete your account?"
        description="This will permanently delete your account and all associated data. This action cannot be undone."
        icon={<Trash2 className="size-5 text-red" />}
        confirmLabel={mutation.isPending ? "Deleting…" : "Delete account"}
        variant="destructive"
        onConfirm={() => mutation.mutate()}
        onClose={() => setOpen(false)}
      />
    </>
  );
};
