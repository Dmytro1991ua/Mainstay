import { format, formatDistanceToNow } from "date-fns";
import { Hash } from "lucide-react";

import type { DetailField } from "@/shared/ui/detail-shell";
import { Pill } from "@/shared/ui/pill";

import { ASSET_STATUS_PILL } from "./config";
import { formatCategoryLabel } from "./utils";

import type { Asset } from "./api/assets.api";

export const getAssetDetailFields = (asset: Asset): DetailField[] => {
  const fields: DetailField[] = [
    { label: "Status", value: <Pill status={ASSET_STATUS_PILL[asset.status]} /> },
    {
      label: "Serial number",
      value: (
        <span className="flex items-center gap-1.5 font-mono text-xs text-text">
          <Hash className="size-3 shrink-0 text-text-3" />
          {asset.serialNumber}
        </span>
      ),
    },
    {
      label: "Category",
      value: <span className="text-text">{formatCategoryLabel(asset.category)}</span>,
    },
    { label: "Location", value: <span className="text-text">{asset.location}</span> },
  ];

  if (asset.manufacturer) {
    fields.push({
      label: "Manufacturer",
      value: <span className="text-text">{asset.manufacturer}</span>,
    });
  }

  if (asset.model) {
    fields.push({ label: "Model", value: <span className="text-text">{asset.model}</span> });
  }

  if (asset.installDate) {
    fields.push({
      label: "Installed",
      value: (
        <span className="text-text-2">{format(new Date(asset.installDate), "MMM d, yyyy")}</span>
      ),
    });
  }

  fields.push(
    {
      label: "Added",
      value: (
        <span className="text-text-2">{format(new Date(asset.createdAt), "MMM d, yyyy")}</span>
      ),
    },
    {
      label: "Last updated",
      value: (
        <span className="text-text-2">
          {formatDistanceToNow(new Date(asset.updatedAt), { addSuffix: true })}
        </span>
      ),
    },
  );

  return fields;
};
