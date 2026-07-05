import { cn } from "@/shared/lib/utils";

import type * as React from "react";

/**
 * Low-level table primitives (shadcn "New York" shape, Mainstay panel tokens).
 * These are the presentational shell only — the reusable BaseTable in
 * `./base-table` composes them with @tanstack/react-table for behaviour.
 */
export function Table({ className, ...props }: React.ComponentProps<"table">) {
  return <table className={cn("w-full caption-bottom text-sm", className)} {...props} />;
}

export function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return <thead className={cn("[&_tr]:border-b [&_tr]:border-border", className)} {...props} />;
}

export function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
}

export function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      className={cn(
        "border-b border-border transition-colors hover:bg-panel-2/60 data-[state=selected]:bg-accent-soft",
        className,
      )}
      {...props}
    />
  );
}

export function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      className={cn(
        "relative h-10 px-3 text-left align-middle text-xs font-medium tracking-wide text-text-3 uppercase",
        "[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-px",
        className,
      )}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      className={cn(
        "px-3 py-2.5 align-middle text-text-2",
        "[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-px",
        className,
      )}
      {...props}
    />
  );
}
