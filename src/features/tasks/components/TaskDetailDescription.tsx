import { FileText } from "lucide-react";

export const TaskDetailDescription = ({ description }: { description: string | null }) =>
  description ? (
    <p className="whitespace-pre-wrap leading-relaxed text-text">{description}</p>
  ) : (
    <div className="flex items-center gap-1.5 italic text-text-3">
      <FileText className="size-3.5 shrink-0 opacity-50" />
      No description provided.
    </div>
  );
