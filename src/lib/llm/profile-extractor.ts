import { generateObject, generateText } from "ai";
import { z } from "zod";
import {
  computeConfidenceScore,
  voiceDnaProfileSchema,
  type VoiceDnaProfile,
} from "@/lib/schemas/voice-dna";
import { createLLM } from "@/lib/llm/provider";
import {
  buildProfileExtractPrompt,
  PROFILE_EXTRACT_SYSTEM,
} from "@/lib/llm/prompts/profile-extract";
import { saveProfile } from "@/lib/supermemory/profile-store";
import { storeDocument } from "@/lib/supermemory/memory-search";
import { MEMORY_TYPES } from "@/lib/supermemory/client";
import { SupermemoryService } from "@/lib/supermemory/service";

const extractedProfileSchema = voiceDnaProfileSchema.omit({
  user_id: true,
  created_at: true,
  updated_at: true,
  confidence_score: true,
});

export async function extractProfileFromTranscript(params: {
  userId: string;
  sessionId: string;
  mode: "text" | "voice";
  language: string;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
}): Promise<VoiceDnaProfile> {
  const transcript = params.messages
    .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
    .join("\n\n");

  const model = createLLM();

  const { text } = await generateText({
    model,
    system: PROFILE_EXTRACT_SYSTEM + "\n\nIMPORTANT: You must return ONLY valid raw JSON matching the requested schema. No markdown, no backticks, no explanations.",
    prompt: buildProfileExtractPrompt(transcript, params.language),
  });

  let object;
  try {
    const cleanText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    object = extractedProfileSchema.parse(JSON.parse(cleanText));
  } catch (e) {
    console.error("Failed to parse profile JSON", e, text);
    throw new Error("Failed to extract profile: Invalid JSON returned from LLM.");
  }

  const now = new Date().toISOString();
  const profile = voiceDnaProfileSchema.parse({
    ...object,
    user_id: params.userId,
    created_at: now,
    updated_at: now,
    confidence_score: 0,
  });

  profile.confidence_score = computeConfidenceScore(profile);
  const saved = await saveProfile(profile);

  await SupermemoryService.addUserMemory(params.userId, transcript, {
    type: MEMORY_TYPES.CONVERSATION_LOG,
    session_id: params.sessionId,
    mode: params.mode,
    language: params.language,
  });

  await storeDocument(
    params.userId,
    MEMORY_TYPES.CONVERSATION_LOG,
    JSON.stringify({
      user_id: params.userId,
      session_id: params.sessionId,
      mode: params.mode,
      language: params.language,
      transcript,
      extracted_traits: Object.keys(object),
      created_at: now,
    }),
    `conversation-${params.sessionId}`,
  );

  return saved;
}

export async function refineProfileFromFeedback(params: {
  userId: string;
  feedbackNote: string;
  currentProfile: VoiceDnaProfile;
}): Promise<Partial<VoiceDnaProfile>> {
  const model = createLLM();

  const { text } = await generateText({
    model,
    system:
      "Given user feedback on a generated tweet, extract profile updates. Only include fields that should change. Prefer adding to avoid_list on negative feedback.\n\nIMPORTANT: You must return ONLY valid raw JSON. No markdown, no backticks, no explanations.",
    prompt: `Current profile tone: ${params.currentProfile.writing_style.tone.join(", ")}
Current avoid list: ${params.currentProfile.avoid_list.join(", ")}

User feedback: ${params.feedbackNote}

Return minimal profile updates as JSON.`,
  });

  let object;
  try {
    const cleanText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    object = JSON.parse(cleanText);
  } catch (e) {
    console.error("Failed to parse refinement JSON", e, text);
    object = {};
  }

  return object as Partial<VoiceDnaProfile>;
}

export async function generateOnboardingReply(
  messages: Array<{ role: "user" | "assistant"; content: string }>,
): Promise<string> {
  const model = createLLM();
  const { buildOnboardingMessages, ONBOARDING_SYSTEM_PROMPT } = await import("@/lib/llm/prompts/onboarding");

  const formattedMessages = buildOnboardingMessages(messages);
  
  // Llama 3 / Groq strict requirement: conversation history MUST start with a 'user' message
  if (formattedMessages.length > 0 && formattedMessages[0].role === "assistant") {
    formattedMessages.unshift({ role: "user", content: "Hi, I'm ready to start onboarding." });
  }

  const { text } = await generateText({
    model,
    system: ONBOARDING_SYSTEM_PROMPT,
    messages: formattedMessages,
  });

  return text;
}
