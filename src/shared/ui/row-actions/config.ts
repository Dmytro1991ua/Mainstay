import { PackagePlus, Pencil, Trash2 } from "lucide-react";

import type { ActionSpec } from "./types";

export const ACTION_SPECS: ActionSpec[] = [
  { prop: "onEdit", verb: "Edit", icon: Pencil, hoverClass: "hover:bg-panel-2 hover:text-text" },
  {
    prop: "onRestock",
    verb: "Restock",
    icon: PackagePlus,
    hoverClass: "hover:bg-amber-soft hover:text-amber",
  },
  {
    prop: "onDelete",
    verb: "Delete",
    icon: Trash2,
    hoverClass: "hover:bg-red-soft hover:text-red",
  },
];

export const BASE_BTN =
  "invisible flex size-7 items-center justify-center rounded-lg text-text-3 transition-colors group-hover:visible";
