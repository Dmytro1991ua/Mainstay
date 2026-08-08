import { cn } from "@/shared/lib/utils";

import type * as React from "react";

type PageShellProps = {
  title: string;
  subtitle?: string;
  /** Optional banner rendered between the title and the content card (use Alert). */
  alert?: React.ReactNode;
  /** Optional controls rendered between the alert and the content card (e.g. tab switchers). */
  toolbar?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  /**
   * "card"  — children are wrapped in a white panel (default; use for table pages)
   * "plain" — children render directly on the page bg (use for dashboard-style
   *           layouts that have their own per-widget cards)
   */
  variant?: "card" | "plain";
};

export const PageShell = ({
  title,
  subtitle,
  alert,
  toolbar,
  children,
  className,
  variant = "card",
}: PageShellProps) => (
  <div className={cn("flex flex-1 flex-col gap-4 min-h-0", className)}>
    <div>
      <h1 className="text-[17px] font-semibold text-text">{title}</h1>
      {subtitle && <p className="mt-0.5 text-[13px] text-text-2">{subtitle}</p>}
    </div>
    {alert}
    {toolbar}
    {variant === "card" ? (
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden rounded-xl border border-border bg-panel p-6 shadow-card">
        {children}
      </div>
    ) : (
      <div className="flex flex-1 flex-col gap-6 min-h-0 overflow-y-auto">{children}</div>
    )}
  </div>
);
