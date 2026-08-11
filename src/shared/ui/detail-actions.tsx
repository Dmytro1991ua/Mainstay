import { Button } from "./button";

import type { ComponentPropsWithoutRef } from "react";

type ButtonVariant = ComponentPropsWithoutRef<typeof Button>["variant"];

export type ActionConfig = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  variant?: ButtonVariant;
  show?: boolean;
};

type DetailActionsProps = {
  actions: ActionConfig[];
};

export const DetailActions = ({ actions }: DetailActionsProps) => (
  <>
    {actions
      .filter(({ show = true }) => show)
      .map(({ label, icon: Icon, onClick, variant = "outline" }) => (
        <Button key={label} variant={variant} size="sm" onClick={onClick}>
          <Icon className="size-3.5" />
          {label}
        </Button>
      ))}
  </>
);
