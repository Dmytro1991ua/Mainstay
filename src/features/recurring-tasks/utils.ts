import type { ActiveFilter } from "./types";

export const toIsActive = (filter: ActiveFilter): boolean | undefined => {
  if (filter === "active") return true;
  if (filter === "paused") return false;
  return undefined;
};
