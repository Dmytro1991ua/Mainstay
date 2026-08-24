import type { AxiosProgressEvent } from "axios";

export const calcUploadPercent = (e: AxiosProgressEvent): number => {
  const total = e.total ?? e.loaded;

  if (!total) return 0;

  return Math.round((e.loaded / total) * 100);
};
