import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import { useFormState } from "@/shared/hooks/use-form-state";
import { getApiErrorMessage, getApiErrorStatus } from "@/shared/lib/api-error";
import { toast } from "@/shared/ui/toast";

import { APPROVE_DEFAULTS, workOrderApproveSchema } from "../validation";

import { useApproveWorkOrderRequest, useRejectWorkOrderRequest } from "./use-work-order-requests";

import type { WorkOrderApproveValues } from "../validation";

// The request already left PENDING (e.g. a teammate triaged it first).
const STALE_STATUS_MESSAGE =
  "This request was already reviewed. Refresh to see its current status.";

export const useWorkOrderTriage = (requestId: string) => {
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  const approveMutation = useApproveWorkOrderRequest();
  const rejectMutation = useRejectWorkOrderRequest();

  const { formState: approveForm, onReset: closeApprove } = useFormState({
    initialValues: APPROVE_DEFAULTS,
    resolver: zodResolver(workOrderApproveSchema),
    onCloseModal: () => setIsApproveOpen(false),
  });

  const openApprove = () => {
    approveForm.reset(APPROVE_DEFAULTS);
    setIsApproveOpen(true);
  };

  const openReject = () => setIsRejectOpen(true);
  const closeReject = () => setIsRejectOpen(false);

  const handleApprove = approveForm.handleSubmit(async (values: WorkOrderApproveValues) => {
    try {
      await approveMutation.mutateAsync({
        id: requestId,
        data: {
          assignedTo: values.assignedTo || undefined,
          dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : undefined,
        },
      });

      toast.success("Request approved", { description: "A task was created from this request." });

      closeApprove();
    } catch (err) {
      if (getApiErrorStatus(err) === 409) {
        toast.error("Couldn't approve", { description: STALE_STATUS_MESSAGE });
      } else {
        toast.error("Failed to approve request", { description: getApiErrorMessage(err) });
      }
    }
  });

  const handleReject = async (reason: string) => {
    try {
      await rejectMutation.mutateAsync({ id: requestId, data: { reason } });

      toast.success("Request rejected");

      closeReject();
    } catch (err) {
      if (getApiErrorStatus(err) === 409) {
        toast.error("Couldn't reject", { description: STALE_STATUS_MESSAGE });
      } else {
        toast.error("Failed to reject request", { description: getApiErrorMessage(err) });
      }
    }
  };

  return {
    isApproveOpen,
    openApprove,
    closeApprove,
    approveForm,
    handleApprove,
    isApproving: approveMutation.isPending,
    isRejectOpen,
    openReject,
    closeReject,
    handleReject,
    isRejecting: rejectMutation.isPending,
  };
};
