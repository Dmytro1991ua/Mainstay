import type { Meter } from "./api/meters.api";

export type SheetMode = { type: "add" } | { type: "edit"; meter: Meter };
