import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

import { cn } from "@/shared/lib/utils";

import { useBreadcrumbs } from "./use-breadcrumbs";

export function Breadcrumbs() {
  const crumbs = useBreadcrumbs();

  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex items-center gap-1.5">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={crumb.label} className="flex items-center gap-1.5">
              {index > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-text-3" />}
              {crumb.to && !isLast ? (
                <Link
                  to={crumb.to}
                  className={cn("truncate text-sm text-text-3 transition-colors hover:text-text")}
                >
                  {crumb.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={cn("truncate text-sm font-semibold text-text")}
                >
                  {crumb.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
