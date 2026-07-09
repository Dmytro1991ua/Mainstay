export enum PillStatus {
  InStock = "In Stock",
  LowStock = "Low Stock",
  OutOfStock = "Out of Stock",
  Open = "Open",
  InProgress = "In Progress",
  Done = "Done",
}

type PillConfig = {
  className: string;
  dotClassName: string;
};

export const PILL_CONFIG: Record<PillStatus, PillConfig> = {
  [PillStatus.InStock]: {
    className: "bg-green-soft text-green",
    dotClassName: "bg-green",
  },
  [PillStatus.LowStock]: {
    className: "bg-amber-soft text-amber",
    dotClassName: "bg-amber",
  },
  [PillStatus.OutOfStock]: {
    className: "bg-red-soft text-red",
    dotClassName: "bg-red",
  },
  [PillStatus.Open]: {
    className: "bg-accent-soft text-accent",
    dotClassName: "bg-accent",
  },
  [PillStatus.InProgress]: {
    className: "bg-purple-soft text-purple",
    dotClassName: "bg-purple",
  },
  [PillStatus.Done]: {
    className: "bg-green-soft text-green",
    dotClassName: "bg-green",
  },
};
