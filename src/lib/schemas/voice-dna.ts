import { z } from "zod";

export const writingStyleSchema = z.object({
  tone: z.array(z.string()).default([]),
  sentence_length: z.string().default("medium"),
  formality: z.string().default("casual"),
  emoji_usage: z.string().default("rare"),
  hashtag_usage: z.string().default("none"),
});

export const opinionSchema = z.object({
  topic: z.string(),
  stance: z.string(),
});

export const voiceDnaProfileSchema = z.object({
  user_id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  language_preferences: z.array(z.string()).default(["en"]),
  writing_style: writingStyleSchema,
  personality: z.array(z.string()).default([]),
  interests: z.array(z.string()).default([]),
  expertise: z.array(z.string()).default([]),
  opinions: z.array(opinionSchema).default([]),
  target_audience: z.array(z.string()).default([]),
  posting_goals: z.array(z.string()).default([]),
  preferred_formats: z.array(z.string()).default([]),
  avoid_list: z.array(z.string()).default([]),
  confidence_score: z.number().min(0).max(1).default(0),
});

export type VoiceDnaProfile = z.infer<typeof voiceDnaProfileSchema>;
export type WritingStyle = z.infer<typeof writingStyleSchema>;
export type Opinion = z.infer<typeof opinionSchema>;

export function createEmptyProfile(userId: string): VoiceDnaProfile {
  const now = new Date().toISOString();
  return voiceDnaProfileSchema.parse({
    user_id: userId,
    created_at: now,
    updated_at: now,
  });
}

export function computeConfidenceScore(profile: VoiceDnaProfile): number {
  let filled = 0;
  const total = 10;

  if (profile.writing_style.tone.length > 0) filled++;
  if (profile.personality.length > 0) filled++;
  if (profile.interests.length > 0) filled++;
  if (profile.expertise.length > 0) filled++;
  if (profile.target_audience.length > 0) filled++;
  if (profile.posting_goals.length > 0) filled++;
  if (profile.preferred_formats.length > 0) filled++;
  if (profile.avoid_list.length > 0) filled++;
  if (profile.opinions.length > 0) filled++;
  if (profile.writing_style.formality !== "casual" || profile.writing_style.sentence_length !== "medium")
    filled++;

  return Math.round((filled / total) * 100) / 100;
}

export function isProfileReadyForGeneration(profile: VoiceDnaProfile): boolean {
  return (
    profile.writing_style.tone.length > 0 &&
    profile.target_audience.length > 0 &&
    (profile.interests.length > 0 || profile.expertise.length > 0)
  );
}

export function mergeProfiles(
  existing: VoiceDnaProfile,
  updates: Partial<VoiceDnaProfile>,
): VoiceDnaProfile {
  const mergeArrays = (a: string[], b?: string[]) =>
    b ? [...new Set([...a, ...b])] : a;

  const merged: VoiceDnaProfile = {
    ...existing,
    ...updates,
    user_id: existing.user_id,
    created_at: existing.created_at,
    updated_at: new Date().toISOString(),
    language_preferences: mergeArrays(
      existing.language_preferences,
      updates.language_preferences,
    ),
    writing_style: {
      ...existing.writing_style,
      ...updates.writing_style,
      tone: mergeArrays(
        existing.writing_style.tone,
        updates.writing_style?.tone,
      ),
    },
    personality: mergeArrays(existing.personality, updates.personality),
    interests: mergeArrays(existing.interests, updates.interests),
    expertise: mergeArrays(existing.expertise, updates.expertise),
    target_audience: mergeArrays(existing.target_audience, updates.target_audience),
    posting_goals: mergeArrays(existing.posting_goals, updates.posting_goals),
    preferred_formats: mergeArrays(
      existing.preferred_formats,
      updates.preferred_formats,
    ),
    avoid_list: mergeArrays(existing.avoid_list, updates.avoid_list),
    opinions: updates.opinions
      ? [...existing.opinions, ...updates.opinions]
      : existing.opinions,
  };

  merged.confidence_score = computeConfidenceScore(merged);
  return voiceDnaProfileSchema.parse(merged);
}
