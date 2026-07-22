import { Link } from "@tanstack/react-router";

import { cn } from "@/shared/lib/utils";

import type { ReactNode } from "react";

type WidgetSectionProps = {
  title: string;
  loading: boolean;
  skeleton: ReactNode;
  children: ReactNode;
  viewAllTo?: string;
  badge?: number;
  className?: string;
};

export const WidgetSection = ({
  title,
  loading,
  skeleton,
  children,
  viewAllTo,
  badge,
  className,
}: WidgetSectionProps) => (
  <section className={cn("flex flex-col", className)}>
    <div className="mb-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-text-3">{title}</h2>
        {badge != null && (
          <span className="rounded-full bg-amber px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
            {badge}
          </span>
        )}
      </div>
      {viewAllTo && !loading && (
        <Link
          to={viewAllTo as "/tasks" | "/inventory" | "/notifications"}
          className="text-[11px] font-medium text-accent hover:underline"
        >
          View all →
        </Link>
      )}
    </div>
    {loading ? (
      skeleton
    ) : (
      <div className="flex h-96 flex-col overflow-y-auto rounded-xl border border-accent bg-panel p-4 shadow-card transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg">
        {children}
      </div>
    )}
  </section>
);
