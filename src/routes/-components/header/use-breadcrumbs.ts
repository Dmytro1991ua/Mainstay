import { useLocation } from "@tanstack/react-router";

import { type Crumb, getBreadcrumbs } from "./breadcrumbs.utils";

/** The crumb trail for the current route. */
export const useBreadcrumbs = (): Crumb[] => getBreadcrumbs(useLocation().pathname);
