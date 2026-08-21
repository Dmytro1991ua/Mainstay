import { Button } from "./button";
import { Tooltip } from "./tooltip";

import type { ComponentPropsWithoutRef } from "react";

type ButtonVariant = ComponentPropsWithoutRef<typeof Button>["variant"];

export type ActionConfig = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  variant?: ButtonVariant;
  show?: boolean;
  disabled?: boolean;
  tooltip?: string;
};

type DetailActionsProps = {
  actions: ActionConfig[];
};

export const DetailActions = ({ actions }: DetailActionsProps) => (
  <>
    {actions
      .filter(({ show = true }) => show)
      .map(({ label, icon: Icon, onClick, variant = "outline", disabled, tooltip }) => {
        const btn = (
          <Button key={label} variant={variant} size="sm" onClick={onClick} disabled={disabled}>
            <Icon className="size-3.5" />
            {label}
          </Button>
        );

        if (disabled && tooltip) {
          return (
            <Tooltip key={label} content={tooltip}>
              <span>{btn}</span>
            </Tooltip>
          );
        }

        return btn;
      })}
  </>
);
