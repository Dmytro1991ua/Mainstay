import { AlertTriangle, Clock, RotateCcw } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { ConfirmDialog } from "@/shared/ui/dialog";
import { EmptyState } from "@/shared/ui/empty-state";
import { Skeleton } from "@/shared/ui/skeleton";
import { formatMoney } from "@/shared/utils";

import { useTaskTimeSection } from "../hooks/use-task-time-section";
import { formatMinutes, getUnratedNote } from "../utils";

import { TimeEntryForm } from "./TimeEntryForm";
import { TimeEntryItem } from "./TimeEntryItem";

const SKELETON_KEYS = ["s1", "s2", "s3"];

type TaskTimeCardProps = {
  taskId: string;
  /** Not on cancelled tasks, and technicians only on tasks assigned to them. */
  canLog: boolean;
};

export const TaskTimeCard = ({ taskId, canLog }: TaskTimeCardProps) => {
  const {
    summary,
    isPending,
    isError,
    refetch,
    isSubmitting,
    pendingDelete,
    setPendingDelete,
    canDelete,
    addEntry,
    confirmDelete,
  } = useTaskTimeSection(taskId);

  const renderContent = () => {
    if (isError) {
      return (
        <EmptyState
          icon={AlertTriangle}
          message="Couldn't load time entries"
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

    if (isPending || !summary) {
      return (
        <div className="flex flex-col gap-3">
          {SKELETON_KEYS.map((key) => (
            <Skeleton key={key} className="h-8 w-full" />
          ))}
        </div>
      );
    }

    if (summary.entries.length === 0) {
      return (
        <EmptyState
          icon={Clock}
          message="No time logged yet"
          description="Logged time shows up here."
        />
      );
    }

    return (
      <>
        <ul className="divide-y divide-border">
          {summary.entries.map((entry) => (
            <TimeEntryItem
              key={entry.id}
              entry={entry}
              canDelete={canDelete(entry)}
              onDelete={setPendingDelete}
            />
          ))}
        </ul>
        <div className="mt-2 flex items-center justify-between border-t border-border pt-3 text-sm">
          <span className="font-medium text-text">Total {formatMinutes(summary.totalMinutes)}</span>
          {summary.totalCost !== undefined && (
            <span className="font-medium text-text tabular-nums">
              {formatMoney(summary.totalCost)}
            </span>
          )}
        </div>
        {getUnratedNote(summary) && (
          <p className="mt-1 text-xs text-text-3">{getUnratedNote(summary)}</p>
        )}
      </>
    );
  };

  return (
    <section className="rounded-xl border border-border bg-panel p-5 shadow-card">
      <h2 className="mb-3 text-sm font-semibold text-text">Time logged</h2>
      {renderContent()}
      {canLog && (
        <div className="-mx-5 mt-4 border-t border-border px-5 pt-4">
          <TimeEntryForm isSubmitting={isSubmitting} onSubmit={addEntry} />
        </div>
      )}
      <ConfirmDialog
        open={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        title="Delete time entry?"
        description="This entry will be permanently removed."
        variant="destructive"
        confirmLabel="Delete"
      />
    </section>
  );
};
