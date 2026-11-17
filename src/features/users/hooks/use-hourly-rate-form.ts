import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { useFormState } from "@/shared/hooks/use-form-state";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { toast } from "@/shared/ui/toast";
import { formatMoney, formatUserName } from "@/shared/utils";

import { updateUserHourlyRate } from "../api/users-api";
import { HOURLY_RATE_DEFAULTS, hourlyRateSchema, type HourlyRateFormValues } from "../validation";

import type { User } from "../api/users-api";

export const useHourlyRateForm = () => {
  const [target, setTarget] = useState<User | null>(null);

  const mutation = useMutation({
    mutationFn: ({ id, hourlyRate }: { id: string; hourlyRate: string | null }) =>
      updateUserHourlyRate(id, hourlyRate),
  });

  const { formState: form, onReset: close } = useFormState<HourlyRateFormValues>({
    initialValues: HOURLY_RATE_DEFAULTS,
    resolver: zodResolver(hourlyRateSchema),
    onCloseModal: () => setTarget(null),
  });

  const open = (user: User) => {
    form.reset(HOURLY_RATE_DEFAULTS);
    setTarget(user);
  };

  const save = form.handleSubmit(async ({ hourlyRate }) => {
    if (!target) return;

    try {
      // The API takes money as a 2-decimal string.
      const updated = await mutation.mutateAsync({
        id: target.id,
        hourlyRate: hourlyRate === "" ? null : Number(hourlyRate).toFixed(2),
      });

      const name = formatUserName(updated.userName);

      toast.success(updated.hourlyRate ? "Hourly rate updated" : "Hourly rate cleared", {
        description: updated.hourlyRate
          ? `${name} is now rated at ${formatMoney(updated.hourlyRate)} per hour.`
          : `${name} has no hourly rate.`,
      });

      close();
    } catch (error) {
      toast.error("Failed to update hourly rate", { description: getApiErrorMessage(error) });
    }
  });

  return { target, form, open, close, save, isSaving: mutation.isPending };
};
