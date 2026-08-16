import { AlertTriangle, RotateCcw } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { DetailShell } from "@/shared/ui/detail-shell";
import { EmptyState } from "@/shared/ui/empty-state";

import { getUserDetailFields } from "../config";
import { useUserDetail } from "../hooks/use-user-detail";

import { UserDeleteDialog } from "./UserDeleteDialog";
import { UserDetailActions } from "./UserDetailActions";
import { UserStatusDialog } from "./UserStatusDialog";

const SKELETON_KEYS = ["Status", "Role", "Username", "Email", "Joined", "Last updated"];

type UserDetailPageProps = { userId: string };

export const UserDetailPage = ({ userId }: UserDetailPageProps) => {
  const {
    user,
    isPending,
    isError,
    refetch,
    canManageUser,
    deleteTarget,
    openDelete,
    closeDelete,
    handleDelete,
    isDeleting,
    statusTarget,
    openDeactivate,
    closeStatus,
    confirmDeactivate,
    handleActivate,
    isUpdatingStatus,
  } = useUserDetail(userId);

  if (isPending) {
    return (
      <DetailShell backTo="/users" title="" fields={[]} isPending skeletonKeys={SKELETON_KEYS} />
    );
  }

  if (isError || !user) {
    return (
      <div className="flex flex-1 flex-col gap-4 min-h-0">
        <DetailShell backTo="/users" title="User not found" fields={[]} />
        <div className="flex flex-1 items-center justify-center rounded-xl border border-border bg-panel p-6 shadow-card">
          <EmptyState
            icon={AlertTriangle}
            message="User not found"
            description="This user may have been deleted or doesn't exist."
            variant="red"
            action={
              <Button onClick={() => refetch()}>
                <RotateCcw className="size-3.5" />
                Retry
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <DetailShell
        backTo="/users"
        title={user.userName}
        actions={
          <UserDetailActions
            canManageUser={canManageUser}
            isActive={user.status === "ACTIVE"}
            onDeactivate={openDeactivate}
            onActivate={handleActivate}
            onDelete={openDelete}
          />
        }
        fields={getUserDetailFields(user)}
        skeletonKeys={SKELETON_KEYS}
      />

      <UserStatusDialog
        target={statusTarget}
        onConfirm={confirmDeactivate}
        onClose={closeStatus}
        isUpdating={isUpdatingStatus}
      />
      <UserDeleteDialog
        target={deleteTarget}
        onConfirm={handleDelete}
        onClose={closeDelete}
        isDeleting={isDeleting}
      />
    </>
  );
};
