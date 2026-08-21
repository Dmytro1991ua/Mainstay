import { useState } from "react";

import { getApiErrorMessage } from "@/shared/lib/api-error";
import { toast } from "@/shared/ui/toast";

type UploadFn = (file: File) => Promise<string | null>;

export const usePhotoUpload = (uploadFn: UploadFn) => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (files: File[]) => {
    const file = files[0];

    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadFn(file);

      setPhotoUrl(url);
    } catch (error) {
      toast.error("Failed to upload photo", { description: getApiErrorMessage(error) });
    } finally {
      setIsUploading(false);
    }
  };

  const reset = () => setPhotoUrl(null);

  return { photoUrl, isUploading, handleUpload, reset };
};
