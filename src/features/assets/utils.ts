import type { TableUrlState } from "@/shared/ui/data-table";

import type { AssetCategory, AssetListParams } from "./api/assets.api";

// cspell:ignore HVAC
const ACRONYMS: Record<string, string> = { HVAC: "HVAC", IT: "IT" };

export const formatCategoryLabel = (value: string): string =>
  value
    .split("_")
    .map((word) => ACRONYMS[word] ?? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

export const getApiErrorStatus = (err: unknown): number | undefined =>
  (err as { response?: { status?: number } })?.response?.status;

export const buildAssetParams = (
  tableState: TableUrlState,
  search: string | undefined,
): AssetListParams => {
  const [activeSort] = tableState.sorting ?? [];

  return {
    search: search || undefined,
    status: tableState.filters?.status?.[0] as AssetListParams["status"],
    category: tableState.filters?.category?.[0] as AssetCategory | undefined,
    sortBy: (activeSort?.id as AssetListParams["sortBy"]) ?? "name",
    sortOrder: activeSort?.desc ? "desc" : "asc",
    limit: 25,
  };
};
