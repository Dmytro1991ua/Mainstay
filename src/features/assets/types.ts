import type { Asset, AssetStats } from "./api/assets.api";
import type { LucideIcon } from "lucide-react";

export type SheetMode = { type: "add" } | { type: "edit"; asset: Asset };

export type AssetStatCard = {
  key: keyof Pick<AssetStats, "total" | "operational" | "down" | "retired">;
  label: string;
  icon: LucideIcon;
  soft: string;
  iconColor: string;
  border: string;
};
