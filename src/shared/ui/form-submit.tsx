import { getApiErrorMessage } from "@/shared/lib/api-error";

import { Button } from "./button";

type FormSubmitProps = {
  isPending: boolean;
  isError?: boolean;
  error?: unknown;
  label: string;
  pendingLabel: string;
};

export const FormSubmit = ({ isPending, isError, error, label, pendingLabel }: FormSubmitProps) => (
  <>
    {isError && <p className="text-sm text-destructive">{getApiErrorMessage(error)}</p>}
    <Button type="submit" disabled={isPending} className="mt-1 h-11 w-full">
      {isPending ? pendingLabel : label}
    </Button>
  </>
);
