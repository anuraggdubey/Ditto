export const PROFILE_EXTRACT_SYSTEM = `You extract a structured Voice DNA profile from an onboarding conversation transcript.

Output ONLY valid JSON matching this shape (no markdown, no explanation):
{
  "language_preferences": ["en"],
  "writing_style": {
    "tone": ["punchy", "confident"],
    "sentence_length": "short|medium|long",
    "formality": "casual|casual-professional|formal",
    "emoji_usage": "none|rare|moderate|heavy",
    "hashtag_usage": "none|rare|moderate|heavy"
  },
  "personality": ["direct", "execution-first"],
  "interests": ["web3", "ai"],
  "expertise": ["full-stack"],
  "opinions": [{"topic": "topic name", "stance": "their position"}],
  "target_audience": ["web3 builders"],
  "posting_goals": ["build authority"],
  "preferred_formats": ["single-tweet hot takes"],
  "avoid_list": ["generic motivational content"]
}

Infer from what the user said. Use empty arrays only when truly unknown. Normalize all languages into English field values.`;

export function buildProfileExtractPrompt(
  transcript: string,
  language: string,
): string {
  return `Extract Voice DNA profile from this onboarding transcript (language: ${language}):

${transcript}

Return JSON only.`;
}
