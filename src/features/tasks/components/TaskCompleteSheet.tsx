import { CheckCircle2, Loader2 } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { FormSheet } from "@/shared/ui/sheet";

import { useTaskCompleteSheet } from "../hooks/use-task-complete-sheet";

import { TaskCompleteAfterPhoto } from "./TaskCompleteAfterPhoto";
import { TaskCompleteChecklist } from "./TaskCompleteChecklist";
import { TaskCompleteParts } from "./TaskCompleteParts";

import type { Task } from "../api/tasks.api";

type TaskCompleteSheetProps = {
  task: Task | null;
  onClose: () => void;
};

const TaskCompleteSheetInner = ({ task, onClose }: { task: Task; onClose: () => void }) => {
  const {
    afterPhotoUrl,
    isUploadingPhoto,
    checkedItems,
    parts,
    pickerItemId,
    setPickerItemId,
    pickerQty,
    setPickerQty,
    checklistItems,
    allChecked,
    isTemplateLoading,
    canComplete,
    selectableItems,
    handlePhotoUpload,
    toggleItem,
    handleAddPart,
    removePart,
    handleComplete,
    isCompleting,
  } = useTaskCompleteSheet(task, onClose);

  return (
    <FormSheet
      open
      onClose={onClose}
      title="Complete Task"
      footer={
        <>
          <div className="flex-1" />
          <Button variant="outline" onClick={onClose} disabled={isCompleting}>
            Cancel
          </Button>
          <Button onClick={handleComplete} disabled={!canComplete || isCompleting}>
            {isCompleting ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <CheckCircle2 className="size-3.5" />
            )}
            {isCompleting ? "Completing…" : "Mark as Completed"}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-6">
        <section>
          <h3 className="mb-2 text-sm font-medium text-text">
            After photo <span className="text-red">*</span>
          </h3>
          <TaskCompleteAfterPhoto
            photoUrl={afterPhotoUrl}
            isUploading={isUploadingPhoto}
            onUpload={handlePhotoUpload}
          />
        </section>

        {task.category && (
          <section>
            <h3 className="mb-2 text-sm font-medium text-text">Checklist</h3>
            <TaskCompleteChecklist
              items={checklistItems}
              checkedItems={checkedItems}
              allChecked={allChecked}
              isLoading={isTemplateLoading}
              onToggle={toggleItem}
            />
          </section>
        )}

        <section>
          <h3 className="mb-2 text-sm font-medium text-text">Parts used</h3>
          <TaskCompleteParts
            parts={parts}
            selectableItems={selectableItems}
            pickerItemId={pickerItemId}
            pickerQty={pickerQty}
            onPickerItemChange={setPickerItemId}
            onPickerQtyChange={setPickerQty}
            onAddPart={handleAddPart}
            onRemovePart={removePart}
          />
        </section>
      </div>
    </FormSheet>
  );
};

export const TaskCompleteSheet = ({ task, onClose }: TaskCompleteSheetProps) => {
  if (!task) return null;
  return <TaskCompleteSheetInner key={task.id} task={task} onClose={onClose} />;
};
