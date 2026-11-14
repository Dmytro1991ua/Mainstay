import { useEffect } from "react";

import { ROLE_DENIED_EVENT } from "@/shared/lib/api-client";
import { queryClient } from "@/shared/lib/query-client";
import { toast } from "@/shared/ui/toast";

import { refreshCurrentUser } from "../lib/refresh-current-user";

const ON_FOCUS_INTERVAL_MS = 60_000;
// A refused request is the strongest sign roles changed, but repeated refusals shouldn't hammer the server.
const ON_DENIED_INTERVAL_MS = 5_000;

/** Keeps the signed-in user's roles current: when a request is refused, and when the tab is reopened. */
export const useSyncRoles = () => {
  useEffect(() => {
    const sync = async (minIntervalMs: number) => {
      const rolesChanged = await refreshCurrentUser(minIntervalMs);

      if (rolesChanged) {
        // Some responses depend on role (dashboard stats, for one), so cached data may be from the old role.
        void queryClient.invalidateQueries();
        toast.info("Your permissions changed", {
          description: "Menus and actions now match your current role.",
        });
      }
    };

    const onVisible = () => {
      if (document.visibilityState === "visible") void sync(ON_FOCUS_INTERVAL_MS);
    };
    const onDenied = () => void sync(ON_DENIED_INTERVAL_MS);

    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener(ROLE_DENIED_EVENT, onDenied);

    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener(ROLE_DENIED_EVENT, onDenied);
    };
  }, []);
};
