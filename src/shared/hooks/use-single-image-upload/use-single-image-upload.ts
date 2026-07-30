import { useState } from "react";

import { toast } from "@/shared/ui/toast";
import { handleImageDrop } from "@/shared/utils/image";

type UploadFn = (file: File) => Promise<void>;

export const useSingleImageUpload = (uploadFn?: UploadFn) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onFileUpload = async (files: File[]) => {
    try {
      setIsUploading(true);

      const file = await handleImageDrop({
        files,
        onSetPreviewImage: setPreviewImage,
      });

      if (!file || !uploadFn) return;

      await uploadFn(file);
    } catch (error) {
      setPreviewImage(null);
      toast.error("Upload failed", {
        description: error instanceof Error ? error.message : "Failed to process image",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const clearPreview = () => setPreviewImage(null);

  return { previewImage, onFileUpload, isUploading, clearPreview };
};
