import type { VoiceDnaProfile } from "@/lib/schemas/voice-dna";

export function buildTweetGenerationPrompt(params: {
  profile: VoiceDnaProfile;
  memoryContext: string[];
  inspirationPatterns: string[];
  topic: string;
  context?: string;
  userName?: string;
}): string {
  const { profile, memoryContext, inspirationPatterns, topic, context, userName } =
    params;

  const memoryBlock =
    memoryContext.length > 0
      ? memoryContext.map((m) => `- ${m}`).join("\n")
      : "No additional memory context.";

  const inspirationBlock =
    inspirationPatterns.length > 0
      ? inspirationPatterns.map((p) => `- ${p}`).join("\n")
      : "No inspiration patterns yet.";

  return `You are generating a tweet as ${userName ?? "the user"}.

VOICE DNA:
- Tone: ${profile.writing_style.tone.join(", ") || "natural"}
- Sentence length: ${profile.writing_style.sentence_length}
- Formality: ${profile.writing_style.formality}
- Emoji usage: ${profile.writing_style.emoji_usage}
- Hashtag usage: ${profile.writing_style.hashtag_usage}
- Personality: ${profile.personality.join(", ") || "authentic"}
- Interests: ${profile.interests.join(", ")}
- Expertise: ${profile.expertise.join(", ")}
- Beliefs/opinions: ${profile.opinions.map((o) => `${o.topic}: ${o.stance}`).join("; ") || "none stated"}
- Preferred formats: ${profile.preferred_formats.join(", ") || "single tweets"}
- Avoid: ${profile.avoid_list.join(", ") || "nothing specific"}

AUDIENCE: ${profile.target_audience.join(", ") || "general tech audience"}
GOAL: ${profile.posting_goals.join(", ") || "engage authentically"}

INSPIRATION PATTERNS (style/structure only — do NOT copy phrasing):
${inspirationBlock}

RELEVANT MEMORY:
${memoryBlock}

TASK:
Write a single tweet (max 280 characters) about: ${topic}
${context ? `Additional context: ${context}` : ""}

Constraints:
- Sound exactly like this user, not generic AI or LinkedIn-bro copy
- Do NOT copy inspiration sources verbatim
- Match their tone, opinions, and avoid-list strictly
- Output ONLY the tweet text, no quotes or explanation`;
}
