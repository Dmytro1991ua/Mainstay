import { Loader2, Play, Upload } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { FileDropzone } from "@/shared/ui/file-dropzone";
import { FormSheet } from "@/shared/ui/sheet";

type TaskStartSheetProps = {
  isOpen: boolean;
  taskTitle: string;
  photoUrl: string | null;
  isUploading: boolean;
  uploadProgress: number;
  isStarting: boolean;
  onClose: () => void;
  onPhotoUpload: (files: File[]) => void;
  onStart: () => void;
};

export const TaskStartSheet = ({
  isOpen,
  taskTitle,
  photoUrl,
  isUploading,
  uploadProgress,
  isStarting,
  onClose,
  onPhotoUpload,
  onStart,
}: TaskStartSheetProps) => {
  let uploadLabel = "Click or drag to upload before photo";
  if (isUploading)
    uploadLabel = uploadProgress > 0 ? `Uploading… ${uploadProgress}%` : "Uploading…";

  return (
    <FormSheet
      open={isOpen}
      onClose={onClose}
      title="Start Work"
      footer={
        <>
          <div className="flex-1" />
          <Button variant="outline" onClick={onClose} disabled={isStarting}>
            Cancel
          </Button>
          <Button onClick={onStart} disabled={!photoUrl || isUploading || isStarting}>
            {isStarting ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Play className="size-3.5" />
            )}
            {isStarting ? "Starting…" : "Start Work"}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm text-text-2">
          Upload a before photo of{" "}
          <span className="font-medium text-text">&ldquo;{taskTitle}&rdquo;</span> to document the
          current condition before starting work.
        </p>

        <div>
          <h3 className="mb-2 text-sm font-medium text-text">
            Before photo <span className="text-red">*</span>
          </h3>

          {photoUrl ? (
            <div className="flex flex-col gap-2">
              <div className="overflow-hidden rounded-lg border border-border">
                <img src={photoUrl} alt="Before" className="w-full object-cover" />
              </div>
              <FileDropzone
                onFileUpload={onPhotoUpload}
                disabled={isUploading}
                className="self-start"
              >
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
          ) : (
            <FileDropzone
              onFileUpload={onPhotoUpload}
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
              <span className="text-sm text-text-3">{uploadLabel}</span>
              <span className="text-xs text-text-3">JPEG, PNG or WebP · max 5 MB</span>
            </FileDropzone>
          )}
        </div>
      </div>
    </FormSheet>
  );
};
