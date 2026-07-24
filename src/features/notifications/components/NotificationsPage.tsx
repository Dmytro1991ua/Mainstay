import { Bell } from "lucide-react";
import { useId, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import { cn } from "@/shared/lib/utils";
import { EmptyState } from "@/shared/ui/empty-state";
import { PageShell } from "@/shared/ui/page-shell";
import { Skeleton } from "@/shared/ui/skeleton";

import { useNotifications } from "../hooks/use-notifications";

import { NotificationRow } from "./NotificationRow";

import type { NotificationType, NotificationsParams } from "../api/notifications-api";

type NotifFilter = "ALL" | "UNREAD" | NotificationType;

type FilterTab = {
  key: NotifFilter;
  label: string;
  params: Omit<NotificationsParams, "page">;
};

const FILTER_TABS: FilterTab[] = [
  { key: "ALL", label: "All", params: {} },
  { key: "UNREAD", label: "Unread", params: { isRead: "false" } },
  { key: "LOW_STOCK", label: "Low stock", params: { type: "LOW_STOCK" } },
  { key: "OUT_OF_STOCK", label: "Out of stock", params: { type: "OUT_OF_STOCK" } },
  { key: "TASK_OVERDUE", label: "Overdue", params: { type: "TASK_OVERDUE" } },
];

const SKEL_KEYS = ["s1", "s2", "s3", "s4", "s5", "s6"] as const;

const NotificationRowSkeleton = () => (
  <div className="flex items-start gap-3 border-b border-border px-4 py-3.5 last:border-0">
    <Skeleton className="mt-0.5 h-8 w-8 shrink-0 rounded-lg" />
    <div className="flex-1 space-y-1.5">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-3.5 w-3/4" />
    </div>
  </div>
);

export const NotificationsPage = () => {
  const uid = useId().replaceAll(":", "");
  const scrollId = `notifications-scroll-${uid}`;

  const [activeTab, setActiveTab] = useState<NotifFilter>("ALL");
  const activeParams = FILTER_TABS.find((t) => t.key === activeTab)!.params;

  const { notifications, isLoading, hasNextPage, fetchNextPage, markRead, markAll } =
    useNotifications(activeParams);

  const unreadCount = useNotifications({ isRead: "false" }).notifications.length;

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
        className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto rounded-xl border border-border"
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
            <NotificationRow key={n.id} notification={n} onMarkRead={markRead} />
          ))}
        </InfiniteScroll>
      </div>
    );
  };

  return (
    <PageShell title="Notifications" subtitle={`${unreadCount} unread`}>
      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        <div className="inline-flex gap-0.5 rounded-[10px] border border-border-2 bg-panel p-1">
          {FILTER_TABS.map(({ key, label }) => (
            <button
              key={key}
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
          onClick={() => markAll()}
          disabled={unreadCount === 0}
          className="h-8.5 rounded-[9px] border border-border-2 bg-panel px-3.5 text-[13px] font-medium text-text-2 transition-colors hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-40"
        >
          Mark all read
        </button>
      </div>

      {renderContent()}
    </PageShell>
  );
};
