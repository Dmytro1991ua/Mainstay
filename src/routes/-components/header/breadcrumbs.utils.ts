import { type AppPath, NAV_ITEMS, ROUTE_LABELS } from "../nav-config";

export type Crumb = {
  label: string;
  /** Present only for known, linkable routes; the current page has none. */
  to?: AppPath;
};

const KNOWN_PATHS = new Set<string>(NAV_ITEMS.map((item) => item.to));

/** Prettify an unknown segment (e.g. a future detail-page slug/id) for display. */
const prettifySegment = (segment: string) =>
  decodeURIComponent(segment)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

/**
 * Build the crumb trail from a pathname. Dashboard is the implicit root, so it's
 * always the first crumb; deeper segments accumulate after it and the last one is
 * the (unlinked) current page. Works for today's flat routes and for future
 * nested ones (e.g. `/inventory/CAF-09`) without changes.
 */
export const getBreadcrumbs = (pathname: string): Crumb[] => {
  const crumbs: Crumb[] = [{ label: "Dashboard", to: "/dashboard" }];

  if (pathname !== "/dashboard") {
    let accum = "";
    for (const segment of pathname.split("/").filter(Boolean)) {
      accum += `/${segment}`;
      crumbs.push({
        label: ROUTE_LABELS[accum] ?? prettifySegment(segment),
        to: KNOWN_PATHS.has(accum) ? (accum as AppPath) : undefined,
      });
    }
  }

  // The last crumb is the current page — strip its link.
  return crumbs.map((crumb, i) => (i === crumbs.length - 1 ? { label: crumb.label } : crumb));
};
