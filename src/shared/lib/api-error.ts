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
