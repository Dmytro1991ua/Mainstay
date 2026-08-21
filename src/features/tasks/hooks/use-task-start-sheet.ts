import { useState } from "react";

import { getApiErrorMessage } from "@/shared/lib/api-error";
import { toast } from "@/shared/ui/toast";

import { usePhotoUpload } from "./use-photo-upload";
import { useUpdateTask, useUploadBeforePhoto } from "./use-tasks";

import type { Task } from "../api/tasks.api";

export const useTaskStartSheet = (task: Task) => {
  const [isOpen, setIsOpen] = useState(false);

  const uploadMutation = useUploadBeforePhoto();
  const updateMutation = useUpdateTask();

  const { photoUrl, isUploading, handleUpload, reset } = usePhotoUpload((file) =>
    uploadMutation.mutateAsync({ id: task.id, file }).then((t) => t.beforePhotoUrl ?? null),
  );

  const openStart = () => {
    reset();
    setIsOpen(true);
  };

  const closeStart = () => setIsOpen(false);

  const handleStart = async () => {
    if (!photoUrl) return;
    try {
      await updateMutation.mutateAsync({ id: task.id, data: { status: "IN_PROGRESS" } });
      toast.success("Task started");
      closeStart();
    } catch (error) {
      toast.error("Failed to start task", { description: getApiErrorMessage(error) });
    }
  };

  return {
    isOpen,
    photoUrl,
    isUploading,
    isStarting: updateMutation.isPending,
    openStart,
    closeStart,
    handlePhotoUpload: handleUpload,
    handleStart,
  };
};
