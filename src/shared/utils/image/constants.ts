export const ALLOWED_IMAGE_FORMATS = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

export const ACCEPTED_IMAGE_TYPES: Record<string, string[]> = {
  "image/*": [".png", ".jpg", ".jpeg", ".webp"],
};

export const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB — avatar uploads
export const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5 MB — task before/after photos

export const MAX_IMAGE_DIMENSION = 4096; // px — validated before resize

export const AVATAR_RESIZE_SIZE = 500; // px — output size after resize

export const FORMAT_ERROR_MESSAGE = "Invalid format. Accepted formats: PNG, JPG, WEBP.";
export const SIZE_ERROR_MESSAGE = "File too large. Maximum allowed size is 2 MB.";
export const DIMENSION_ERROR_MESSAGE = `Image dimensions exceed the maximum allowed size of ${MAX_IMAGE_DIMENSION} × ${MAX_IMAGE_DIMENSION} px.`;
export const READ_ERROR_MESSAGE = "Failed to read the image file.";
export const RESIZE_ERROR_MESSAGE = "Failed to resize the image.";
