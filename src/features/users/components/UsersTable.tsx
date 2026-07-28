import { AlertTriangle, Plus, RotateCcw, Users } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { DataTable } from "@/shared/ui/data-table";
import type { OnSetTableState, TableUrlState } from "@/shared/ui/data-table";
import { EmptyState } from "@/shared/ui/empty-state";

import { USER_FILTER_CONFIG } from "../config";
import { useCancelInvite } from "../hooks/use-cancel-invite";
import { useDeleteUser } from "../hooks/use-delete-user";
import { useInviteUser } from "../hooks/use-invite-user";
import { useUserColumns } from "../hooks/use-user-columns";
import { useUserStatus } from "../hooks/use-user-status";
import { useUsersData } from "../hooks/use-users";

import { InviteUserSheet } from "./InviteUserSheet";
import { UserCancelInviteDialog } from "./UserCancelInviteDialog";
import { UserDeleteDialog } from "./UserDeleteDialog";
import { UserStatusDialog } from "./UserStatusDialog";

type UsersTableProps = {
  tableState: TableUrlState;
  onSetTableState: OnSetTableState;
};

export const UsersTable = ({ tableState, onSetTableState }: UsersTableProps) => {
  const {
    rows,
    isLoading,
    isError,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isAdmin,
    currentUserId,
  } = useUsersData(tableState);

  const { open, form, openInvite, closeSheet, handleSave, resendInvite, isSaving } =
    useInviteUser();

  const {
    deactivateTarget,
    openDeactivate,
    closeDialog,
    handleActivate,
    confirmDeactivate,
    isUpdating: isStatusUpdating,
  } = useUserStatus();

  const {
    deleteTarget,
    openDelete,
    closeDialog: closeDeleteDialog,
    confirmDelete,
    isDeleting,
  } = useDeleteUser();

  const {
    cancelTarget,
    openCancel,
    closeDialog: closeCancelDialog,
    confirmCancel,
    isCancelling,
  } = useCancelInvite();

  const columns = useUserColumns({
    isAdmin,
    currentUserId,
    onDeactivate: openDeactivate,
    onActivate: handleActivate,
    onDelete: openDelete,
    onResendInvite: (row) => resendInvite(row.email, row.role as "MANAGER" | "TECHNICIAN"),
    onCancelInvite: openCancel,
  });

  return (
    <>
      <DataTable
        tableId="users"
        columns={columns}
        data={rows}
        isPending={isLoading}
        isError={isError}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
        filterConfig={USER_FILTER_CONFIG}
        searchPlaceholder="Search by name or email…"
        enableRowSelection
        getRowId={(row) => row.id}
        tableState={tableState}
        onSetTableState={onSetTableState}
        exportFilename="users"
        actions={
          isAdmin ? (
            <Button onClick={openInvite} disabled={isError}>
              <Plus />
              Invite user
            </Button>
          ) : null
        }
        emptyState={
          <EmptyState
            icon={Users}
            message="No team members found"
            description="Try adjusting your filters."
          />
        }
        errorState={
          <EmptyState
            icon={AlertTriangle}
            message="Couldn't load users"
            description="The server didn't respond."
            variant="red"
            action={
              <Button onClick={() => refetch()}>
                <RotateCcw className="size-3.5" />
                Retry
              </Button>
            }
          />
        }
      />
      <InviteUserSheet
        open={open}
        form={form}
        onSave={handleSave}
        onClose={closeSheet}
        isSaving={isSaving}
      />
      <UserStatusDialog
        target={deactivateTarget}
        onConfirm={confirmDeactivate}
        onClose={closeDialog}
        isUpdating={isStatusUpdating}
      />
      <UserDeleteDialog
        target={deleteTarget}
        onConfirm={confirmDelete}
        onClose={closeDeleteDialog}
        isDeleting={isDeleting}
      />
      <UserCancelInviteDialog
        target={cancelTarget}
        onConfirm={confirmCancel}
        onClose={closeCancelDialog}
        isCancelling={isCancelling}
      />
    </>
  );
};
