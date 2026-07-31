import { readImageFile } from "./readImageFile";
import { resizeImage } from "./resizeImage";

import type { HandleImageDropParams } from "./types";

/**
 * Orchestrates the full drop flow:
 *   1. Validate (format, size, dimensions) via readImageFile — throws on failure
 *   2. Resize for preview via resizeImage (Canvas API)
 *   3. Set the preview image
 *   4. Return the original File for upload
 */
export const handleImageDrop = async ({
  files,
  onSetPreviewImage,
}: HandleImageDropParams): Promise<File | undefined> => {
  const file = files[0];

  if (!file) return undefined;

  await readImageFile(file);

  const preview = await resizeImage(file);

  onSetPreviewImage(preview);

  return file;
};
