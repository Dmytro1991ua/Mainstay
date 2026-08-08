import { Bell, Trash2 } from "lucide-react";
import InfiniteScroll from "react-infinite-scroll-component";

import { cn } from "@/shared/lib/utils";
import { ConfirmDialog } from "@/shared/ui/dialog";
import { EmptyState } from "@/shared/ui/empty-state";

import { FILTER_TABS, SKEL_KEYS } from "../config";
import { useNotificationsList } from "../hooks/use-notifications-list";

import { NotificationRow } from "./NotificationRow";
import { NotificationRowSkeleton } from "./NotificationRowSkeleton";

export const NotificationsList = () => {
  const {
    scrollId,
    activeTab,
    setActiveTab,
    notifications,
    isLoading,
    hasNextPage,
    fetchNextPage,
    markRead,
    markAll,
    deleteTarget,
    setDeleteTarget,
    handleDeleteConfirm,
    unreadCount,
  } = useNotificationsList();

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="overflow-hidden rounded-xl border border-border">
          {SKEL_KEYS.map((k) => (
            <NotificationRowSkeleton key={k} />
          ))}
        </div>
      );
    }
    if (notifications.length === 0) {
      return (
        <EmptyState
          icon={Bell}
          message="You're all caught up"
          description="No notifications in this view."
          variant="green"
        />
      );
    }
    return (
      <div
        id={scrollId}
        className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto rounded-xl border border-border bg-panel"
      >
        <InfiniteScroll
          dataLength={notifications.length}
          next={fetchNextPage}
          hasMore={hasNextPage ?? false}
          loader={<NotificationRowSkeleton />}
          scrollableTarget={scrollId}
          style={{ overflow: "visible" }}
        >
          {notifications.map((n) => (
            <NotificationRow
              key={n.id}
              notification={n}
              onMarkRead={markRead}
              onDelete={setDeleteTarget}
            />
          ))}
        </InfiniteScroll>
      </div>
    );
  };

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        <div className="inline-flex gap-0.5 rounded-[10px] border border-border-2 bg-panel p-1">
          {FILTER_TABS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={cn(
                "rounded-[7px] px-3 py-1.5 text-[12.5px] font-medium transition-colors",
                activeTab === key
                  ? "bg-accent text-white shadow-sm"
                  : "text-text-2 hover:bg-panel-2 hover:text-text",
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <button
          type="button"
          onClick={() => markAll()}
          disabled={unreadCount === 0}
          className="h-8.5 rounded-[9px] border border-accent bg-accent px-3.5 text-[13px] font-medium text-white transition-colors hover:bg-accent-soft hover:text-accent disabled:pointer-events-none disabled:opacity-40"
        >
          Mark All Read
        </button>
      </div>
      {renderContent()}
      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete notification"
        description="This notification will be permanently removed."
        icon={<Trash2 className="size-5 text-red" />}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </>
  );
};
