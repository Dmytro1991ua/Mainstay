import { Link, useLocation } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

import { cn } from "@/shared/lib/utils";

import { type AppPath, NAV_ITEMS, ROUTE_LABELS } from "./nav-config";

type Crumb = {
  label: string;
  /** Present only for known, linkable routes; the current page has none. */
  to?: AppPath;
};

const KNOWN_PATHS = new Set<string>(NAV_ITEMS.map((i) => i.to));

/** Prettify an unknown segment (e.g. a future detail-page slug/id) for display. */
const prettify = (segment: string) =>
  decodeURIComponent(segment)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

/**
 * Build the crumb trail from a pathname. Dashboard is the implicit root, so it's
 * always the first crumb; deeper segments accumulate after it and the last one is
 * the (unlinked) current page. Works for today's flat routes and for future
 * nested ones (e.g. `/inventory/CAF-09`) without changes.
 */
export function getBreadcrumbs(pathname: string): Crumb[] {
  const crumbs: Crumb[] = [{ label: "Dashboard", to: "/dashboard" }];

  if (pathname !== "/dashboard") {
    const segments = pathname.split("/").filter(Boolean);
    let accum = "";
    for (const segment of segments) {
      accum += `/${segment}`;
      crumbs.push({
        label: ROUTE_LABELS[accum] ?? prettify(segment),
        to: KNOWN_PATHS.has(accum) ? (accum as AppPath) : undefined,
      });
    }
  }

  // The last crumb is the current page — strip its link.
  return crumbs.map((c, i) => (i === crumbs.length - 1 ? { label: c.label } : c));
}

export function Breadcrumbs() {
  const { pathname } = useLocation();
  const crumbs = getBreadcrumbs(pathname);

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
