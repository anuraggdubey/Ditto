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

  const { object } = await generateObject({
    model,
    schema: extractedProfileSchema,
    system: PROFILE_EXTRACT_SYSTEM,
    prompt: buildProfileExtractPrompt(transcript, params.language),
  });

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

  const { object } = await generateObject({
    model,
    schema: z.object({
      avoid_list: z.array(z.string()).optional(),
      writing_style: z
        .object({
          tone: z.array(z.string()).optional(),
        })
        .optional(),
      personality: z.array(z.string()).optional(),
    }),
    system:
      "Given user feedback on a generated tweet, extract profile updates. Only include fields that should change. Prefer adding to avoid_list on negative feedback.",
    prompt: `Current profile tone: ${params.currentProfile.writing_style.tone.join(", ")}
Current avoid list: ${params.currentProfile.avoid_list.join(", ")}

User feedback: ${params.feedbackNote}

Return minimal profile updates.`,
  });

  return object;
}

export async function generateOnboardingReply(
  messages: Array<{ role: "user" | "assistant"; content: string }>,
): Promise<string> {
  const model = createLLM();
  const { buildOnboardingMessages } = await import("@/lib/llm/prompts/onboarding");

  const { text } = await generateText({
    model,
    messages: buildOnboardingMessages(messages),
  });

  return text;
}
