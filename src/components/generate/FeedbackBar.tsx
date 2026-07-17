import { ThumbsDown, ThumbsUp, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import type { FeedbackType } from "@/lib/schemas/feedback";

export function FeedbackBar({
  onFeedback,
  disabled,
}: {
  onFeedback: (params: {
    type: FeedbackType;
    finalText?: string;
    customNote?: string;
  }) => void;
  disabled?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const [customNote, setCustomNote] = useState("");

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => onFeedback({ type: "like" })}
          className="gap-1.5"
        >
          <ThumbsUp className="h-3.5 w-3.5" />
          Like
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => onFeedback({ type: "dislike", customNote: customNote || undefined })}
          className="gap-1.5"
        >
          <ThumbsDown className="h-3.5 w-3.5" />
          Dislike
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => setEditing(!editing)}
          className="gap-1.5"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </Button>
      </div>

      <Textarea
        placeholder="Optional feedback note (e.g. 'too formal', 'never use this word')"
        value={customNote}
        onChange={(e) => setCustomNote(e.target.value)}
        className="min-h-[60px] text-sm"
        disabled={disabled}
      />

      {editing && (
        <div className="space-y-2">
          <Textarea
            placeholder="Edit the tweet…"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="min-h-[100px]"
          />
          <Button
            type="button"
            size="sm"
            disabled={disabled || !editText.trim()}
            onClick={() => {
              onFeedback({ type: "edit", finalText: editText, customNote: customNote || undefined });
              setEditing(false);
            }}
          >
            Submit edit
          </Button>
        </div>
      )}
    </div>
  );
}
