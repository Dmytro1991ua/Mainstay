import { cn } from "@/shared/lib/utils";

import type { ReactNode } from "react";

type SettingCardProps = { children: ReactNode; className?: string };

export const SettingCard = ({ children, className }: SettingCardProps) => (
  <div
    className={cn(
      "flex h-full flex-col rounded-[13px] border border-border bg-panel p-5 shadow-sm",
      className,
    )}
  >
    {children}
  </div>
);
