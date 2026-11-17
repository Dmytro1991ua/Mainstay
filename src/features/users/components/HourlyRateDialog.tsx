import { DollarSign } from "lucide-react";

import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/shared/ui/dialog";
import { FormField } from "@/shared/ui/form-field";
import { formatUserName } from "@/shared/utils";

import type { User } from "../api/users-api";
import type { HourlyRateFormValues } from "../validation";
import type * as React from "react";
import type { UseFormReturn } from "react-hook-form";

type HourlyRateDialogProps = {
  target: User | null;
  form: UseFormReturn<HourlyRateFormValues>;
  onSave: (e?: React.BaseSyntheticEvent) => Promise<void>;
  onClose: () => void;
  isSaving: boolean;
};

export const HourlyRateDialog = ({
  target,
  form,
  onSave,
  onClose,
  isSaving,
}: HourlyRateDialogProps) => {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Dialog open={target !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <form onSubmit={onSave} noValidate>
          <DialogBody className="flex flex-col items-center gap-3 pb-2 pt-8 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-panel-2">
              <DollarSign className="size-5 text-accent" />
            </div>
            <div className="flex flex-col items-center gap-1">
              <DialogTitle>Set hourly rate</DialogTitle>
              <DialogDescription>
                {target ? `For ${formatUserName(target.userName)}. ` : null}
                Only time logged from now on uses the new rate.
              </DialogDescription>
            </div>
            <div className="w-full text-left">
              <FormField
                id="user-hourly-rate"
                label="Hourly rate (USD)"
                inputMode="decimal"
                placeholder="e.g. 25.00"
                registration={register("hourlyRate")}
                error={errors.hourlyRate}
                disabled={isSaving}
                hint="Leave empty to clear the rate."
              />
            </div>
          </DialogBody>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSaving}>
                Back
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving…" : "Save rate"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
