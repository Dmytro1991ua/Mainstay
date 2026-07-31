import { AVATAR_RESIZE_SIZE, RESIZE_ERROR_MESSAGE } from "./constants";

/**
 * Resizes an image file using the Canvas API.
 * Maintains aspect ratio — the longer side is capped at maxSize.
 * Returns a DataURL of the resized image.
 */
export const resizeImage = (file: File, maxSize = AVATAR_RESIZE_SIZE): Promise<string> =>
  new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;

      if (width > maxSize || height > maxSize) {
        if (width >= height) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        } else {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error(RESIZE_ERROR_MESSAGE));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL(file.type, 0.9));
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(RESIZE_ERROR_MESSAGE));
    };

    img.src = objectUrl;
  });
