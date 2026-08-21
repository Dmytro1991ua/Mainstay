export enum PillStatus {
  InStock = "In Stock",
  LowStock = "Low Stock",
  OutOfStock = "Out of Stock",
  Open = "Open",
  InProgress = "In Progress",
  Done = "Done",
  Cancelled = "Cancelled",
}

type PillConfig = {
  className: string;
  dotClassName: string;
};

export const PILL_CONFIG: Record<PillStatus, PillConfig> = {
  [PillStatus.InStock]: {
    className: "bg-green-soft text-green border border-green-border",
    dotClassName: "bg-green",
  },
  [PillStatus.LowStock]: {
    className: "bg-amber-soft text-amber border border-amber-border",
    dotClassName: "bg-amber",
  },
  [PillStatus.OutOfStock]: {
    className: "bg-red-soft text-red border border-red-border",
    dotClassName: "bg-red",
  },
  [PillStatus.Open]: {
    className: "bg-accent-soft text-accent border border-accent-border",
    dotClassName: "bg-accent",
  },
  [PillStatus.InProgress]: {
    className: "bg-purple-soft text-purple border border-purple-border",
    dotClassName: "bg-purple",
  },
  [PillStatus.Done]: {
    className: "bg-green-soft text-green border border-green-border",
    dotClassName: "bg-green",
  },
  [PillStatus.Cancelled]: {
    className: "bg-red-soft text-red border border-red-border",
    dotClassName: "bg-red",
  },
};
