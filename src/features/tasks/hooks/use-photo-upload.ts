import { useState } from "react";

import { getApiErrorMessage } from "@/shared/lib/api-error";
import { toast } from "@/shared/ui/toast";
import { MAX_PHOTO_SIZE, readImageFile } from "@/shared/utils/image";

type UploadFn = (file: File, onProgress: (percent: number) => void) => Promise<string | null>;

export const usePhotoUpload = (uploadFn: UploadFn, initialUrl: string | null = null) => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(initialUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleUpload = async (files: File[]) => {
    const file = files[0];

    if (!file) return;

    try {
      await readImageFile(file, MAX_PHOTO_SIZE);
    } catch (error) {
      toast.error("Invalid photo", { description: (error as Error).message });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    try {
      const url = await uploadFn(file, setUploadProgress);

      setPhotoUrl(url);
    } catch (error) {
      toast.error("Failed to upload photo", { description: getApiErrorMessage(error) });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const reset = () => setPhotoUrl(null);

  return { photoUrl, isUploading, uploadProgress, handleUpload, reset };
};
