import { Link } from "@tanstack/react-router";
import { AlertTriangle, ClipboardList, RotateCcw } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/ui/empty-state";
import { Pill, PillStatus } from "@/shared/ui/pill";
import { Skeleton } from "@/shared/ui/skeleton";
import { formatShortDate } from "@/shared/utils";

import { useAssetTasks } from "../hooks/use-assets";

import type { AssetTask } from "../api/assets.api";

const STATUS_PILL: Record<AssetTask["status"], PillStatus> = {
  OPEN: PillStatus.Open,
  IN_PROGRESS: PillStatus.InProgress,
  DONE: PillStatus.Done,
  CANCELLED: PillStatus.Cancelled,
};

const SKELETON_KEYS = ["h1", "h2", "h3"];

export const AssetMaintenanceHistory = ({ assetId }: { assetId: string }) => {
  const { data, isPending, isError, refetch, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useAssetTasks(assetId);

  const tasks = data?.pages.flatMap((p) => p.data) ?? [];
  const total = data?.pages[0]?.meta.total ?? 0;

  const renderContent = () => {
    if (isError) {
      return (
        <EmptyState
          icon={AlertTriangle}
          message="Couldn't load history"
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

    if (isPending) {
      return (
        <div className="flex flex-col gap-2">
          {SKELETON_KEYS.map((key) => (
            <Skeleton key={key} className="h-11 w-full rounded-lg" />
          ))}
        </div>
      );
    }

    if (tasks.length === 0) {
      return (
        <EmptyState
          icon={ClipboardList}
          message="No maintenance tasks"
          description="Tasks logged against this asset will appear here."
        />
      );
    }

    return (
      <>
        <ul className="flex flex-col gap-1">
          {tasks.map((task) => (
            <li key={task.id}>
              <Link
                to="/tasks/$taskId"
                params={{ taskId: task.id }}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-panel-2"
              >
                <span className="flex-1 truncate text-sm font-medium text-text">{task.title}</span>
                {task.dueDate && (
                  <span className="shrink-0 text-xs text-text-3">
                    {formatShortDate(task.dueDate)}
                  </span>
                )}
                <Pill status={STATUS_PILL[task.status]} className="shrink-0" />
              </Link>
            </li>
          ))}
        </ul>
        {hasNextPage && (
          <div className="mt-3 flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? "Loading…" : `Load more (${tasks.length} of ${total})`}
            </Button>
          </div>
        )}
      </>
    );
  };

  return (
    <section className="rounded-xl border border-border bg-panel p-5 shadow-card">
      <h2 className="mb-3 text-sm font-semibold text-text">
        Maintenance history{data ? ` (${total})` : ""}
      </h2>
      {renderContent()}
    </section>
  );
};
