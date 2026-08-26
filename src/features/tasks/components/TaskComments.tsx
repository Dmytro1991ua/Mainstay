import { AlertTriangle, MessageSquare, RotateCcw } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { ConfirmDialog } from "@/shared/ui/dialog";
import { EmptyState } from "@/shared/ui/empty-state";
import { Skeleton } from "@/shared/ui/skeleton";

import { useTaskCommentSection } from "../hooks/use-task-comment-section";

import { CommentComposer } from "./CommentComposer";
import { CommentItem } from "./CommentItem";

const SKELETON_KEYS = ["s1", "s2", "s3"];

type TaskCommentsProps = {
  taskId: string;
  /** DONE/CANCELLED tasks are read-only: existing comments show, but no new ones. */
  canComment: boolean;
};

export const TaskComments = ({ taskId, canComment }: TaskCommentsProps) => {
  const {
    comments,
    isPending,
    isError,
    refetch,
    isSubmitting,
    pendingDelete,
    setPendingDelete,
    canDelete,
    addComment,
    confirmDelete,
  } = useTaskCommentSection(taskId);

  const emptyDescription = canComment
    ? "Be the first to leave a note on this task."
    : "No comments were left on this task.";

  const renderContent = () => {
    if (isError) {
      return (
        <EmptyState
          icon={AlertTriangle}
          message="Couldn't load comments"
          description="The server didn't respond."
          variant="red"
          action={
            <Button onClick={() => refetch()}>
              <RotateCcw className="size-3.5" />
              Retry
            </Button>
          }
        />
      );
    }

    if (isPending || !comments) {
      return (
        <div className="flex flex-col gap-3">
          {SKELETON_KEYS.map((key) => (
            <div key={key} className="flex gap-3">
              <Skeleton className="size-7 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2 py-0.5">
                <Skeleton className="h-3.5 w-40" />
                <Skeleton className="h-3.5 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (comments.length === 0) {
      return (
        <EmptyState icon={MessageSquare} message="No comments yet" description={emptyDescription} />
      );
    }

    return (
      <ul className="divide-y divide-border">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            canDelete={canDelete(comment)}
            onDelete={setPendingDelete}
          />
        ))}
      </ul>
    );
  };

  return (
    <section className="rounded-xl border border-border bg-panel p-5 shadow-card">
      <h2 className="mb-3 text-sm font-semibold text-text">
        Comments{comments ? ` (${comments.length})` : ""}
      </h2>
      {renderContent()}
      <div className="-mx-5 mt-4 border-t border-border px-5 pt-4">
        {canComment ? (
          <CommentComposer isSubmitting={isSubmitting} onSubmit={addComment} />
        ) : (
          <p className="text-center text-xs text-text-3">
            Commenting is closed on completed and cancelled tasks.
          </p>
        )}
      </div>
      <ConfirmDialog
        open={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        title="Delete comment?"
        description="This comment will be permanently removed."
        variant="destructive"
        confirmLabel="Delete"
      />
    </section>
  );
};
