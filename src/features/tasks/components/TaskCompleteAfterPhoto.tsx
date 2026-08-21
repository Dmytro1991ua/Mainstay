import { Loader2, Upload } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { FileDropzone } from "@/shared/ui/file-dropzone";

type TaskCompleteAfterPhotoProps = {
  photoUrl: string | null;
  isUploading: boolean;
  onUpload: (files: File[]) => void;
};

export const TaskCompleteAfterPhoto = ({
  photoUrl,
  isUploading,
  onUpload,
}: TaskCompleteAfterPhotoProps) => {
  if (photoUrl) {
    return (
      <div className="flex flex-col gap-2">
        <div className="overflow-hidden rounded-lg border border-border">
          <img src={photoUrl} alt="After" className="w-full object-cover" />
        </div>
        <FileDropzone onFileUpload={onUpload} disabled={isUploading} className="self-start">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isUploading}
            className="pointer-events-none"
          >
            {isUploading ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Upload className="size-3.5" />
            )}
            Replace photo
          </Button>
        </FileDropzone>
      </div>
    );
  }

  return (
    <FileDropzone
      onFileUpload={onUpload}
      disabled={isUploading}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-panel-2/40 px-4 py-8 transition-colors",
        !isUploading && "hover:border-accent/50 hover:bg-panel-2",
      )}
    >
      {isUploading ? (
        <Loader2 className="size-6 animate-spin text-text-3" />
      ) : (
        <Upload className="size-6 text-text-3" />
      )}
      <span className="text-sm text-text-3">
        {isUploading ? "Uploading…" : "Click or drag to upload after photo"}
      </span>
      <span className="text-xs text-text-3">JPEG, PNG or WebP · max 5 MB</span>
    </FileDropzone>
  );
};
