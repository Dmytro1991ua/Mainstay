import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import { useFormState } from "@/shared/hooks/use-form-state";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { toast } from "@/shared/ui/toast";

import { FORM_DEFAULTS, workOrderRequestFormSchema } from "../validation";

import { useCreateWorkOrderRequest } from "./use-work-order-requests";

import type { CreateWorkOrderRequestInput } from "../api/work-order-requests.api";

export const useWorkOrderRequestForm = () => {
  const [isOpen, setIsOpen] = useState(false);

  const createMutation = useCreateWorkOrderRequest();

  const { formState: form, onReset: closeSheet } = useFormState({
    initialValues: FORM_DEFAULTS,
    resolver: zodResolver(workOrderRequestFormSchema),
    onCloseModal: () => setIsOpen(false),
  });

  const openSheet = () => {
    form.reset(FORM_DEFAULTS);
    setIsOpen(true);
  };

  const handleSave = form.handleSubmit(async (values) => {
    try {
      await createMutation.mutateAsync({
        title: values.title,
        description: values.description || undefined,
        category: (values.category || undefined) as CreateWorkOrderRequestInput["category"],
        priority: values.priority,
        assetId: values.assetId || undefined,
      });

      toast.success("Request submitted", {
        description: `"${values.title}" was filed for review.`,
      });

      closeSheet();
    } catch (err) {
      toast.error("Failed to submit request", { description: getApiErrorMessage(err) });
    }
  });

  return {
    isOpen,
    openSheet,
    closeSheet,
    form,
    handleSave,
    isSaving: createMutation.isPending,
  };
};
