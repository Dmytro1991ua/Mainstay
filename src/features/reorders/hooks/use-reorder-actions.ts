import { useState } from "react";

import { getApiErrorMessage, getApiErrorStatus } from "@/shared/lib/api-error";
import { toast } from "@/shared/ui/toast";

import { useCancelReorder, useOrderReorder, useReceiveReorder } from "./use-reorders";

import type { ReceiveReorderInput, Reorder } from "../api/reorders.api";
import type { ReorderActionType } from "../types";

export type PendingReorderAction = { type: ReorderActionType; reorder: Reorder };

const STALE_MESSAGE = "This reorder's status changed. Refresh to see the latest.";

const SUCCESS_MESSAGE: Record<ReorderActionType, string> = {
  order: "Marked as ordered",
  receive: "Reorder received",
  cancel: "Reorder cancelled",
};

export const useReorderActions = () => {
  const [pending, setPending] = useState<PendingReorderAction | null>(null);

  const orderMutation = useOrderReorder();
  const receiveMutation = useReceiveReorder();
  const cancelMutation = useCancelReorder();

  const runners: Record<
    ReorderActionType,
    (reorder: Reorder, payload?: ReceiveReorderInput) => Promise<unknown>
  > = {
    order: (reorder) => orderMutation.mutateAsync(reorder.id),
    receive: (reorder, payload) => receiveMutation.mutateAsync({ id: reorder.id, data: payload }),
    cancel: (reorder) => cancelMutation.mutateAsync(reorder.id),
  };

  const openAction = (type: ReorderActionType, reorder: Reorder) => setPending({ type, reorder });
  const closeAction = () => setPending(null);

  const confirm = async (payload?: ReceiveReorderInput) => {
    if (!pending) return;

    const { type, reorder } = pending;

    try {
      await runners[type](reorder, payload);

      toast.success(SUCCESS_MESSAGE[type]);

      closeAction();
    } catch (err) {
      const status = getApiErrorStatus(err);

      if (status === 409 || status === 404) {
        toast.error("Action unavailable", { description: STALE_MESSAGE });
      } else {
        toast.error("Action failed", { description: getApiErrorMessage(err) });
      }
    }
  };

  const isPending =
    orderMutation.isPending || receiveMutation.isPending || cancelMutation.isPending;

  return { pending, openAction, closeAction, confirm, isPending };
};
