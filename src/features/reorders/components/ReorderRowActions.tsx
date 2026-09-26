import { Button } from "@/shared/ui/button";

import { REORDER_ACTIONS, REORDER_STATUS_ACTIONS } from "../config";

import type { Reorder } from "../api/reorders.api";
import type { ReorderActionType } from "../types";

type ReorderRowActionsProps = {
  reorder: Reorder;
  onAction: (type: ReorderActionType, reorder: Reorder) => void;
};

export const ReorderRowActions = ({ reorder, onAction }: ReorderRowActionsProps) => {
  const actions = REORDER_STATUS_ACTIONS[reorder.status];

  if (actions.length === 0) return null;

  return (
    <div className="flex items-center justify-end gap-1.5">
      {actions.map((type) => {
        const { buttonLabel, buttonVariant, icon: Icon } = REORDER_ACTIONS[type];

        return (
          <Button
            key={type}
            variant={buttonVariant}
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onAction(type, reorder);
            }}
          >
            <Icon className="size-3.5" />
            {buttonLabel}
          </Button>
        );
      })}
    </div>
  );
};
