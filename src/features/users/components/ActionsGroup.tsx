import type { ActionConfig, ActionKey, UserTableRow } from "../config";

const btnBase =
  "invisible flex size-7 items-center justify-center rounded-lg text-text-3 transition-colors group-hover:visible";

type ActionsGroupProps = {
  configs: ActionConfig[];
  row: UserTableRow;
  isAdmin: boolean;
  handlers: Record<ActionKey, (row: UserTableRow) => void>;
};

export const ActionsGroup = ({ configs, row, isAdmin, handlers }: ActionsGroupProps) => (
  <div className="flex items-center justify-end gap-1">
    {configs
      .filter((cfg) => !cfg.show || cfg.show(row, isAdmin))
      .map((cfg) => {
        const Icon = cfg.icon;
        const title = typeof cfg.title === "function" ? cfg.title(row) : cfg.title;
        return (
          <button
            key={cfg.key}
            type="button"
            title={title}
            className={`${btnBase} ${cfg.hoverClass}`}
            onClick={(e) => {
              e.stopPropagation();
              handlers[cfg.key](row);
            }}
          >
            <Icon className="size-3.5" />
            <span className="sr-only">{cfg.srLabel(row)}</span>
          </button>
        );
      })}
  </div>
);
