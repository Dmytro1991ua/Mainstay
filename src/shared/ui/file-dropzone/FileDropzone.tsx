import { type ReactNode } from "react";
import { useDropzone, type Accept } from "react-dropzone";

import { cn } from "@/shared/lib/utils";
import { ACCEPTED_IMAGE_TYPES } from "@/shared/utils/image";

type FileDropzoneProps = {
  onFileUpload: (files: File[]) => void;
  accept?: Accept;
  disabled?: boolean;
  multiple?: boolean;
  children?: ReactNode;
  className?: string;
};

export const FileDropzone = ({
  onFileUpload,
  accept = ACCEPTED_IMAGE_TYPES,
  disabled = false,
  multiple = false,
  children,
  className,
}: FileDropzoneProps) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: onFileUpload,
    accept,
    disabled,
    multiple,
  });

  return (
    <div {...getRootProps()} className={cn("outline-none", className)}>
      <input {...getInputProps()} />
      {children}
    </div>
  );
};
