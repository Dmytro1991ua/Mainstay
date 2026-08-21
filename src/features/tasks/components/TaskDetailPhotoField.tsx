import { Loader2, Upload } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { FileDropzone } from "@/shared/ui/file-dropzone";

import { PhotoLink } from "./PhotoLink";

import type { Task } from "../api/tasks.api";

type BeforePhotoFieldProps = {
  task: Task;
  canUploadBeforePhoto: boolean;
  isUploadingBeforePhoto: boolean;
  onUploadBeforePhoto: (files: File[]) => void;
};

export const BeforePhotoField = ({
  task,
  canUploadBeforePhoto,
  isUploadingBeforePhoto,
  onUploadBeforePhoto,
}: BeforePhotoFieldProps) => {
  if (task.beforePhotoUrl) return <PhotoLink href={task.beforePhotoUrl} alt="Before" />;

  if (canUploadBeforePhoto) {
    return (
      <FileDropzone onFileUpload={onUploadBeforePhoto} disabled={isUploadingBeforePhoto}>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isUploadingBeforePhoto}
          className="pointer-events-none"
        >
          {isUploadingBeforePhoto ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Upload className="size-3.5" />
          )}
          {isUploadingBeforePhoto ? "Uploading…" : "Upload before photo"}
        </Button>
      </FileDropzone>
    );
  }

  return <span className="text-text-3">Not uploaded</span>;
};
