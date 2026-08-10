import type * as React from "react";

type PropRowProps = { label: string; children: React.ReactNode };

export const PropRow = ({ label, children }: PropRowProps) => (
  <div className="flex items-start gap-6 border-t border-border px-6 py-4 first:border-t-0">
    <span className="w-32 shrink-0 pt-0.5 text-[13px] font-medium text-text-2">{label}</span>
    <div className="flex-1 text-sm text-text">{children}</div>
  </div>
);
