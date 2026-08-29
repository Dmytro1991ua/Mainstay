import type { Asset } from "./api/assets.api";

export type SheetMode = { type: "add" } | { type: "edit"; asset: Asset };
