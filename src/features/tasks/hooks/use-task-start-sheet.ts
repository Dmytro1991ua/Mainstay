import { useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";

import { uploadBeforePhoto } from "../api/tasks.api";

import { usePhotoUpload } from "./use-photo-upload";
import { TASKS_KEY, useUpdateTask } from "./use-tasks";

import type { Task } from "../api/tasks.api";

export const useTaskStartSheet = (task: Task) => {
  const queryClient = useQueryClient();
  const updateMutation = useUpdateTask();
  const didUploadRef = useRef(false);

  const { photoUrl, isUploading, uploadProgress, handleUpload } = usePhotoUpload(
    async (file, onProgress) => {
      // Server requires IN_PROGRESS status before accepting a before-photo upload.
      await updateMutation.mutateAsync({ id: task.id, data: { status: "IN_PROGRESS" } });
      const updated = await uploadBeforePhoto(task.id, file, onProgress);
      didUploadRef.current = true;
      queryClient.invalidateQueries({ queryKey: [TASKS_KEY] });
      return updated.beforePhotoUrl ?? null;
    },
    task.beforePhotoUrl ?? null,
  );

  // A fresh upload already set the status to IN_PROGRESS. Only when the sheet reuses
  // an existing before-photo (re-opened after reverting to OPEN) do we set it here.
  const handleStart = async () => {
    if (!didUploadRef.current && task.status !== "IN_PROGRESS") {
      await updateMutation.mutateAsync({ id: task.id, data: { status: "IN_PROGRESS" } });
    }
  };

  return {
    photoUrl,
    isUploading,
    isStarting: updateMutation.isPending && !isUploading,
    uploadProgress,
    handlePhotoUpload: handleUpload,
    handleStart,
  };
};
