import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";

import { cn } from "@/shared/lib/utils";

import type * as React from "react";

type AlertVariant = "info" | "warning" | "success" | "error";

type AlertProps = {
  children: React.ReactNode;
  variant?: AlertVariant;
  className?: string;
};

const CONFIG = {
  info: {
    Icon: Info,
    className: "border-accent bg-accent-border text-accent",
  },
  warning: {
    Icon: AlertTriangle,
    className: "border-amber-border bg-amber-soft text-amber",
  },
  success: {
    Icon: CheckCircle,
    className: "border-green-border bg-green-soft text-green",
  },
  error: {
    Icon: XCircle,
    className: "border-red-border bg-red-soft text-red",
  },
} satisfies Record<
  AlertVariant,
  { Icon: React.ComponentType<{ className?: string }>; className: string }
>;

export const Alert = ({ children, variant = "info", className }: AlertProps) => {
  const { Icon, className: variantClass } = CONFIG[variant];
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded-lg border px-4 py-2.5 text-[13px] font-medium",
        variantClass,
        className,
      )}
    >
      <Icon className="size-4 shrink-0" />
      <span>{children}</span>
    </div>
  );
};
