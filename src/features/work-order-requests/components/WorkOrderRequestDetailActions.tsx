import { Button } from "@/shared/ui/button";

import { TRIAGE_ACTIONS } from "../config";

import type { TriageActionKey } from "../types";

type WorkOrderRequestDetailActionsProps = {
  onApprove: () => void;
  onReject: () => void;
};

export const WorkOrderRequestDetailActions = ({
  onApprove,
  onReject,
}: WorkOrderRequestDetailActionsProps) => {
  const handlers: Record<TriageActionKey, () => void> = {
    reject: onReject,
    approve: onApprove,
  };

  return (
    <>
      {TRIAGE_ACTIONS.map(({ key, label, icon: Icon, variant }) => (
        <Button key={key} variant={variant} onClick={handlers[key]}>
          <Icon className="size-3.5" />
          {label}
        </Button>
      ))}
    </>
  );
};
