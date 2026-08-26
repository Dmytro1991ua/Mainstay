import { Loader2, Send } from "lucide-react";
import { useState } from "react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

import { COMMENT_MAX_LENGTH } from "../api/comments.api";

type CommentComposerProps = {
  isSubmitting: boolean;
  /** Resolves true when the comment was created; false keeps the text for a retry. */
  onSubmit: (body: string) => Promise<boolean>;
};

export const CommentComposer = ({ isSubmitting, onSubmit }: CommentComposerProps) => {
  const [body, setBody] = useState("");

  const trimmed = body.trim();
  const isTooLong = body.length > COMMENT_MAX_LENGTH;
  const canSubmit = trimmed.length > 0 && !isTooLong && !isSubmitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    const created = await onSubmit(trimmed);

    if (created) setBody("");
  };

  return (
    <div className="flex flex-col gap-2">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write a comment…"
        rows={3}
        disabled={isSubmitting}
        className={cn(
          "w-full resize-y rounded-lg border border-border bg-panel px-3 py-2 text-sm shadow-sm outline-none",
          "focus:border-accent focus:ring-2 focus:ring-accent/50",
          isTooLong && "border-red focus:border-red focus:ring-red/40",
        )}
      />
      <div className="flex items-center justify-between">
        <span className={cn("text-xs text-text-3", isTooLong && "text-red")}>
          {body.length}/{COMMENT_MAX_LENGTH}
        </span>
        <Button size="sm" onClick={handleSubmit} disabled={!canSubmit}>
          {isSubmitting ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Send className="size-3.5" />
          )}
          Add comment
        </Button>
      </div>
    </div>
  );
};
