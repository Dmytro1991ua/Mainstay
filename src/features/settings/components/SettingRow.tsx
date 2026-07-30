import { cn } from "@/shared/lib/utils";

import type { ReactNode } from "react";

type SettingRowProps = {
  title: string;
  description?: string;
  children: ReactNode;
  border?: boolean;
};

export const SettingRow = ({ title, description, children, border = false }: SettingRowProps) => (
  <div
    className={cn("flex items-center justify-between py-2.5", border && "border-t border-border")}
  >
    <div>
      <div className="text-[13.5px] font-medium">{title}</div>
      {description && <div className="text-[12px] text-text-3">{description}</div>}
    </div>
    {children}
  </div>
);
