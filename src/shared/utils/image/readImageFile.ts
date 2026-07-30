import {
  ALLOWED_IMAGE_FORMATS,
  DIMENSION_ERROR_MESSAGE,
  FORMAT_ERROR_MESSAGE,
  MAX_FILE_SIZE,
  MAX_IMAGE_DIMENSION,
  READ_ERROR_MESSAGE,
  SIZE_ERROR_MESSAGE,
} from "./constants";

/**
 * Validates format, file size, and pixel dimensions.
 * Returns the DataURL (base64) of the original image on success.
 * Throws a descriptive Error on any validation failure.
 */
export const readImageFile = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    if (!ALLOWED_IMAGE_FORMATS.includes(file.type)) {
      reject(new Error(FORMAT_ERROR_MESSAGE));
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      reject(new Error(SIZE_ERROR_MESSAGE));
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();

      img.onload = () => {
        if (img.width > MAX_IMAGE_DIMENSION || img.height > MAX_IMAGE_DIMENSION) {
          reject(new Error(DIMENSION_ERROR_MESSAGE));
          return;
        }
        resolve(dataUrl);
      };

      img.onerror = () => reject(new Error(READ_ERROR_MESSAGE));
      img.src = dataUrl;
    };

    reader.onerror = () => reject(new Error(READ_ERROR_MESSAGE));
    reader.readAsDataURL(file);
  });
