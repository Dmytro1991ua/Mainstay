import { Pencil, Trash2 } from "lucide-react";

type RowActionsProps = {
  label: string;
  onEdit?: () => void;
  onDelete?: () => void;
};

export const RowActions = ({ label, onEdit, onDelete }: RowActionsProps) => {
  const commonBtnStyles =
    "invisible flex size-7 items-center justify-center rounded-lg text-text-3 transition-colors group-hover:visible";

  const stop = (e: React.MouseEvent, fn: () => void) => {
    e.stopPropagation();
    fn();
  };

  return (
    <div className="flex items-center justify-end gap-1">
      {onEdit && (
        <button
          onClick={(e) => stop(e, onEdit)}
          className={`${commonBtnStyles} hover:bg-panel-2 hover:text-text`}
        >
          <Pencil className="size-3.5" />
          <span className="sr-only">Edit {label}</span>
        </button>
      )}
      {onDelete && (
        <button
          onClick={(e) => stop(e, onDelete)}
          className={`${commonBtnStyles} hover:bg-red-soft hover:text-red`}
        >
          <Trash2 className="size-3.5" />
          <span className="sr-only">Delete {label}</span>
        </button>
      )}
    </div>
  );
};
