import { useState } from "react";

import { toast } from "@/shared/ui/toast";
import { handleImageDrop } from "@/shared/utils/image";

type UploadFn = (file: File) => Promise<void>;

export const useSingleImageUpload = (uploadFn?: UploadFn) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onFileUpload = async (files: File[]) => {
    setIsUploading(true);

    let file: File | undefined;

    try {
      file = await handleImageDrop({ files, onSetPreviewImage: setPreviewImage });
    } catch (error) {
      setPreviewImage(null);
      toast.error("Upload failed", {
        description: error instanceof Error ? error.message : "Failed to process image",
      });
      setIsUploading(false);
      return;
    }

    if (!file || !uploadFn) {
      setIsUploading(false);
      return;
    }

    try {
      await uploadFn(file);
    } catch {
      // Upload errors are toasted by the caller's onError — just clear the preview.
      setPreviewImage(null);
    } finally {
      setIsUploading(false);
    }
  };

  const clearPreview = () => setPreviewImage(null);

  return { previewImage, onFileUpload, isUploading, clearPreview };
};
