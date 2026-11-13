import { isAxiosError } from "axios";

type ApiErrorPropertyShape = { code: string; message: string; fields?: Record<string, string[]> };
type ApiErrorBody = {
  success: false;
  error: ApiErrorPropertyShape;
};

const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again.";

export const getApiErrorMessage = (error: unknown, fallback = DEFAULT_ERROR_MESSAGE): string => {
  if (isAxiosError<ApiErrorBody>(error)) {
    return error.response?.data?.error?.message ?? fallback;
  }

  return fallback;
};

export const getApiErrorStatus = (error: unknown): number | undefined =>
  isAxiosError(error) ? error.response?.status : undefined;

// The server sends this (403) for a deactivated user on any request. A 403 is also used for role
// errors, so the text is the only way to tell them apart.
const ACCOUNT_DEACTIVATED_MESSAGE = "Your account has been deactivated";

export const isAccountDeactivatedError = (error: unknown): boolean =>
  getApiErrorStatus(error) === 403 && getApiErrorMessage(error, "") === ACCOUNT_DEACTIVATED_MESSAGE;
