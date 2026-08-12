import { cn } from "@/shared/lib/utils";

import { ACTION_SPECS, BASE_BTN } from "./config";

import type { RowActionsProps } from "./types";

export const RowActions = (props: RowActionsProps) => {
  const { label } = props;

  const stop = (e: React.MouseEvent, fn: () => void) => {
    e.stopPropagation();
    fn();
  };

  return (
    <div className="flex items-center justify-end gap-1">
      {ACTION_SPECS.map(({ prop, verb, icon: Icon, hoverClass }) => {
        const onClick = props[prop];
        if (!onClick) return null;
        return (
          <button
            key={prop}
            type="button"
            title={`${verb} ${label}`}
            onClick={(e) => stop(e, onClick)}
            className={cn(BASE_BTN, hoverClass)}
          >
            <Icon className="size-3.5" />
            <span className="sr-only">
              {verb} {label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
