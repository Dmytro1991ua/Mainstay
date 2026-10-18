import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { getApiErrorMessage, getApiErrorStatus } from "@/shared/lib/api-error";
import { toast } from "@/shared/ui/toast";

import { getReadingSuccessMessage } from "../utils";

import { METERS_KEY, useRecordReading } from "./use-meters";

import type { Meter } from "../api/meters.api";

/**
 * Recording flow for one meter at a time. Only the selected meter's id is kept, and the meter itself
 * is read from the live `meters` list, so the dialog always shows the refreshed current reading
 * (and closes if the meter disappears).
 */
export const useReadingForm = (meters: Meter[]) => {
  const recordMutation = useRecordReading();
  const queryClient = useQueryClient();

  const [targetId, setTargetId] = useState<string | null>(null);

  const target = meters.find((meter) => meter.id === targetId) ?? null;

  const openRecord = (meter: Meter) => setTargetId(meter.id);

  const closeRecord = () => setTargetId(null);

  const handleRecord = async (value: number) => {
    if (!target) return;

    try {
      const result = await recordMutation.mutateAsync({ id: target.id, data: { value } });

      toast.success("Reading recorded", { description: getReadingSuccessMessage(result) });

      closeRecord();
    } catch (err) {
      if (getApiErrorStatus(err) === 409) {
        // Someone recorded a newer reading first. The server only gives the current value in its
        // message text, so refresh the meters and let the dialog show the live number.
        queryClient.invalidateQueries({ queryKey: [METERS_KEY] });

        toast.error("That reading is lower than the current one", {
          description: "A newer reading was recorded. The current value has been refreshed.",
        });
      } else {
        toast.error("Failed to record reading", { description: getApiErrorMessage(err) });
      }
    }
  };

  return {
    target,
    openRecord,
    closeRecord,
    handleRecord,
    isRecording: recordMutation.isPending,
  };
};
