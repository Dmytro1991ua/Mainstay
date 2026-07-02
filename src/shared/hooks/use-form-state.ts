import { useCallback } from "react";
import {
  type DefaultValues,
  type FieldValues,
  type Resolver,
  type UseFormReturn,
  useForm,
} from "react-hook-form";

export type UseFormStateProps<T extends FieldValues> = {
  onCloseModal?: () => void;
  initialValues: DefaultValues<T>;
  resolver?: Resolver<T>;
  shouldFocusError?: boolean;
  mode?: "onSubmit" | "onChange" | "onBlur" | "all" | "onTouched";
};

type UseFormStateReturn<T extends FieldValues> = {
  onReset: () => void;
  formState: UseFormReturn<T>;
};

export const useFormState = <T extends FieldValues>({
  onCloseModal,
  initialValues,
  resolver,
  shouldFocusError,
  mode,
}: UseFormStateProps<T>): UseFormStateReturn<T> => {
  const formState = useForm<T>({
    shouldUnregister: false,
    mode: mode ?? "onSubmit",
    defaultValues: initialValues,
    resolver,
    shouldFocusError,
  });

  const { reset, clearErrors } = formState;

  const onReset = useCallback((): void => {
    reset(initialValues);
    clearErrors();
    onCloseModal?.();
  }, [reset, clearErrors, onCloseModal, initialValues]);

  return { formState, onReset };
};
