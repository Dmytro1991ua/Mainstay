import { Trash2 } from "lucide-react";

import { Avatar } from "@/shared/ui/avatar";
import { formatTimeAgo, formatUserName, getInitials } from "@/shared/utils";

import type { TaskComment } from "../api/comments.api";

type CommentItemProps = {
  comment: TaskComment;
  canDelete: boolean;
  onDelete: (comment: TaskComment) => void;
};

export const CommentItem = ({ comment, canDelete, onDelete }: CommentItemProps) => (
  <li className="flex gap-3 py-3">
    <Avatar
      initials={getInitials(comment.author.userName).toUpperCase()}
      title={comment.author.userName}
      className="size-7 shrink-0 bg-accent text-[10px] text-white"
    />
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-2">
        <span className="truncate text-sm font-medium text-text">
          {formatUserName(comment.author.userName)}
        </span>
        <span className="shrink-0 text-xs text-text-3">{formatTimeAgo(comment.createdAt)}</span>
        {canDelete && (
          <button
            type="button"
            onClick={() => onDelete(comment)}
            className="ml-auto flex size-6 shrink-0 items-center justify-center rounded text-text-3 transition-colors hover:bg-red-soft hover:text-red"
            aria-label="Delete comment"
          >
            <Trash2 className="size-3.5" />
          </button>
        )}
      </div>
      <p className="mt-0.5 text-sm break-words whitespace-pre-wrap text-text-2">{comment.body}</p>
    </div>
  </li>
);
