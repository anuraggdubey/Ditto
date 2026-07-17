import { z } from "zod";

export const feedbackTypeSchema = z.enum(["like", "dislike", "edit", "custom"]);

export const feedbackLogSchema = z.object({
  user_id: z.string(),
  tweet_generation_id: z.string(),
  generated_text: z.string(),
  final_text: z.string().nullable().default(null),
  feedback_type: feedbackTypeSchema,
  custom_note: z.string().nullable().default(null),
  diff_summary: z.string().nullable().default(null),
  created_at: z.string(),
});

export type FeedbackLog = z.infer<typeof feedbackLogSchema>;
export type FeedbackType = z.infer<typeof feedbackTypeSchema>;

export function summarizeDiff(original: string, edited: string): string {
  if (original === edited) return "No changes";
  const origLen = original.length;
  const editLen = edited.length;
  const delta = editLen - origLen;
  return `Length ${origLen} → ${editLen} (${delta >= 0 ? "+" : ""}${delta} chars)`;
}
