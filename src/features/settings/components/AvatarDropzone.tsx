import { Camera, X } from "lucide-react";

import { useSingleImageUpload } from "@/shared/hooks/use-single-image-upload";
import { cn } from "@/shared/lib/utils";
import { Avatar } from "@/shared/ui/avatar";
import { FileDropzone } from "@/shared/ui/file-dropzone";

type AvatarDropzoneProps = {
  initials: string;
  currentAvatar?: string | null;
  onUpload?: (file: File) => Promise<void>;
  className?: string;
};

export const AvatarDropzone = ({
  initials,
  currentAvatar,
  onUpload,
  className = "size-20",
}: AvatarDropzoneProps) => {
  const { previewImage, onFileUpload, isUploading, clearPreview } = useSingleImageUpload(onUpload);
  const displayImage = previewImage ?? currentAvatar;

  return (
    <div className="relative shrink-0">
      <FileDropzone
        onFileUpload={onFileUpload}
        disabled={isUploading}
        className={cn("group relative cursor-pointer rounded-full", className)}
      >
        <Avatar initials={initials} src={displayImage} className={cn("text-2xl", className)} />

        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/35 opacity-0 transition-opacity group-hover:opacity-100">
          {isUploading ? (
            <span className="text-[11px] font-semibold text-white">…</span>
          ) : (
            <Camera className="size-4 text-white" />
          )}
        </div>
      </FileDropzone>

      {previewImage && !isUploading && (
        <button
          type="button"
          onClick={clearPreview}
          className="absolute -right-1 -top-1 flex size-4.5 items-center justify-center rounded-full border border-border bg-panel text-text-2 shadow-sm transition-colors hover:text-text"
          aria-label="Remove preview"
        >
          <X className="size-2.5" />
        </button>
      )}
    </div>
  );
};
