import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

import { useFormState } from "@/shared/hooks/use-form-state";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { toast } from "@/shared/ui/toast";

import { sendInvite } from "../api/users-api";
import { INVITE_USER_DEFAULTS, inviteUserSchema } from "../validation";

import type { InviteUserFormValues } from "../validation";

const INVITES_KEY = ["users", "pending-invites"];

export const useInviteUser = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: sendInvite,
    onSuccess: (invite) => {
      queryClient.invalidateQueries({ queryKey: INVITES_KEY });
      toast.success("Invite sent", { description: `An invitation was sent to ${invite.email}.` });
    },
  });

  const [open, setOpen] = useState(false);

  const closeModal = () => setOpen(false);

  const { formState: form, onReset: closeSheet } = useFormState<InviteUserFormValues>({
    initialValues: INVITE_USER_DEFAULTS,
    resolver: zodResolver(inviteUserSchema),
    onCloseModal: closeModal,
  });

  const openInvite = () => {
    form.reset(INVITE_USER_DEFAULTS);

    setOpen(true);
  };

  const handleSave = form.handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync({ email: values.email, role: values.role });

      closeSheet();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        toast.error("Invite already pending", {
          description: "A pending invite already exists for this email address.",
        });
      } else {
        toast.error("Failed to send invite", { description: getApiErrorMessage(error) });
      }
    }
  });

  const resendInvite = async (email: string, role: "MANAGER" | "TECHNICIAN") => {
    try {
      await mutation.mutateAsync({ email, role });
    } catch (error) {
      toast.error("Failed to resend invite", { description: getApiErrorMessage(error) });
    }
  };

  return {
    open,
    form,
    openInvite,
    closeSheet,
    handleSave,
    resendInvite,
    isSaving: mutation.isPending,
  };
};
