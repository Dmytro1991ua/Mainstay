import { CircleCheck, CircleX, Info, Loader2, TriangleAlert, X } from "lucide-react";
import { toast as sonnerToast } from "sonner";

import { cn } from "@/shared/lib/utils";

import type * as React from "react";

// ─── Config ──────────────────────────────────────────────────────────────────

type ToastType = "success" | "error" | "warning" | "info" | "loading";

type ToastConfig = {
  icon: React.ComponentType<{ className?: string }>;
  iconClass: string;
  iconBgClass: string;
  barClass: string;
  gradientClass: string;
};

const TOAST_CONFIG: Record<ToastType, ToastConfig> = {
  success: {
    icon: CircleCheck,
    iconClass: "text-green",
    iconBgClass: "bg-green-soft",
    barClass: "bg-green",
    gradientClass: "bg-gradient-to-r from-green-soft to-panel",
  },
  error: {
    icon: CircleX,
    iconClass: "text-red",
    iconBgClass: "bg-red-soft",
    barClass: "bg-red",
    gradientClass: "bg-gradient-to-r from-red-soft to-panel",
  },
  warning: {
    icon: TriangleAlert,
    iconClass: "text-amber",
    iconBgClass: "bg-amber-soft",
    barClass: "bg-amber",
    gradientClass: "bg-gradient-to-r from-amber-soft to-panel",
  },
  info: {
    icon: Info,
    iconClass: "text-accent",
    iconBgClass: "bg-accent-soft",
    barClass: "bg-accent",
    gradientClass: "bg-gradient-to-r from-accent-soft to-panel",
  },
  loading: {
    icon: Loader2,
    iconClass: "text-accent",
    iconBgClass: "bg-accent-soft",
    barClass: "bg-accent",
    gradientClass: "bg-gradient-to-r from-accent-soft to-panel",
  },
};

// ─── Card ─────────────────────────────────────────────────────────────────────

type ToastCardProps = {
  id: string | number;
  type: ToastType;
  title: string;
  description?: string;
};

function ToastCard({ id, type, title, description }: ToastCardProps) {
  const { icon: Icon, iconClass, iconBgClass, barClass, gradientClass } = TOAST_CONFIG[type];

  return (
    <div
      className={cn(
        "flex w-89 max-w-[calc(100vw-2rem)] overflow-hidden rounded-r-xl border border-l-0 border-border shadow-card-lg",
        gradientClass,
      )}
    >
      <div className={cn("w-1 shrink-0", barClass)} />
      <div className={cn("flex flex-1 gap-3 p-3.5", description ? "items-start" : "items-center")}>
        <div
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full",
            iconBgClass,
          )}
        >
          <Icon className={cn("size-4", iconClass, type === "loading" && "animate-spin")} />
        </div>
        <div className={cn("flex-1", description && "pt-0.5")}>
          <p className="text-sm font-semibold text-text">{title}</p>
          {description && <p className="mt-0.5 text-xs text-text-3">{description}</p>}
        </div>
        <button
          onClick={() => sonnerToast.dismiss(id)}
          className={cn(
            "flex size-5 shrink-0 items-center justify-center rounded text-text-3 transition-colors hover:text-text",
            description && "mt-0.5",
          )}
        >
          <X className="size-3.5" />
          <span className="sr-only">Dismiss</span>
        </button>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

type ToastOptions = {
  description?: string;
  duration?: number;
  id?: string | number;
};

function show(type: ToastType, title: string, opts?: ToastOptions): string | number {
  const options: { duration: number; id?: string | number } = { duration: opts?.duration ?? 4000 };
  if (opts?.id !== undefined) options.id = opts.id;
  return sonnerToast.custom(
    (id) => <ToastCard id={id} type={type} title={title} description={opts?.description} />,
    options,
  );
}

export const toast = {
  success: (title: string, opts?: ToastOptions) => show("success", title, opts),
  error: (title: string, opts?: ToastOptions) => show("error", title, opts),
  warning: (title: string, opts?: ToastOptions) => show("warning", title, opts),
  info: (title: string, opts?: ToastOptions) => show("info", title, opts),
  loading: (title: string, opts?: ToastOptions) =>
    show("loading", title, { duration: Infinity, ...opts }),
  dismiss: sonnerToast.dismiss,
};
