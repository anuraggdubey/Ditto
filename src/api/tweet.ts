import { randomUUID } from "node:crypto";
import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { feedbackLogSchema, feedbackTypeSchema, summarizeDiff } from "@/lib/schemas/feedback";
import { tweetGenerationSchema } from "@/lib/schemas/onboarding";
import { isProfileReadyForGeneration } from "@/lib/schemas/voice-dna";
import { createLLM } from "@/lib/llm/provider";
import { buildTweetGenerationPrompt } from "@/lib/llm/prompts/tweet-generate";
import { refineProfileFromFeedback } from "@/lib/llm/profile-extractor";
import { getProfile, mergeAndSaveProfile } from "@/lib/supermemory/profile-store";
import { searchRelevantContext, storeDocument } from "@/lib/supermemory/memory-search";
import { MEMORY_TYPES } from "@/lib/supermemory/client";
import { getInspirationPatterns } from "@/lib/supermemory/inspiration-store";
import { SupermemoryService } from "@/lib/supermemory/service";
import { getOrCreateUserId } from "@/api/auth";

export const generateTweet = createServerFn({ method: "POST" })
  .validator(
    z.object({
      topic: z.string().min(1),
      context: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const userId = getOrCreateUserId();
    const profile = await getProfile(userId);

    if (!profile) {
      throw new Error(
        "Complete onboarding first to build your Voice DNA profile.",
      );
    }

    if (!isProfileReadyForGeneration(profile)) {
      throw new Error(
        "Your profile needs more detail (tone, audience, and at least one interest). Continue onboarding.",
      );
    }

    const memoryContext = await searchRelevantContext(
      userId,
      `${data.topic} ${data.context ?? ""} writing style`,
    );
    const inspirationPatterns = await getInspirationPatterns(userId);

    const prompt = buildTweetGenerationPrompt({
      profile,
      memoryContext,
      inspirationPatterns,
      topic: data.topic,
      context: data.context,
    });

    const model = createLLM();
    const { text } = await generateText({ model, prompt });
    const tweet = text.trim().replace(/^["']|["']$/g, "");

    const generationId = randomUUID();
    const generation = tweetGenerationSchema.parse({
      id: generationId,
      user_id: userId,
      topic: data.topic,
      context: data.context,
      generated_text: tweet,
      created_at: new Date().toISOString(),
    });

    await storeDocument(
      userId,
      MEMORY_TYPES.TWEET_GENERATION,
      JSON.stringify(generation),
      `tweet-${generationId}`,
    );

    await SupermemoryService.addUserMemory(
      userId,
      `Generated tweet about "${data.topic}": ${tweet}`,
      {
        type: MEMORY_TYPES.TWEET_GENERATION,
        generation_id: generationId,
      },
    );

    return { generationId, tweet, generation };
  });

export const submitFeedback = createServerFn({ method: "POST" })
  .validator(
    z.object({
      generationId: z.string(),
      generatedText: z.string(),
      feedbackType: feedbackTypeSchema,
      finalText: z.string().optional(),
      customNote: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const userId = getOrCreateUserId();
    const profile = await getProfile(userId);

    const finalText = data.finalText ?? data.generatedText;
    const diffSummary =
      data.feedbackType === "edit"
        ? summarizeDiff(data.generatedText, finalText)
        : null;

    const feedback = feedbackLogSchema.parse({
      user_id: userId,
      tweet_generation_id: data.generationId,
      generated_text: data.generatedText,
      final_text: data.feedbackType === "edit" ? finalText : null,
      feedback_type: data.feedbackType,
      custom_note: data.customNote ?? null,
      diff_summary: diffSummary,
      created_at: new Date().toISOString(),
    });

    await storeDocument(
      userId,
      MEMORY_TYPES.FEEDBACK_LOG,
      JSON.stringify(feedback),
      `feedback-${data.generationId}-${Date.now()}`,
    );

    await SupermemoryService.addUserMemory(
      userId,
      `Tweet feedback (${data.feedbackType}): ${data.customNote ?? data.generatedText.slice(0, 120)}`,
      {
        type: MEMORY_TYPES.FEEDBACK_LOG,
        feedback_type: data.feedbackType,
        generation_id: data.generationId,
      },
    );

    if (profile && (data.feedbackType === "dislike" || data.customNote)) {
      const note =
        data.customNote ??
        (data.feedbackType === "dislike" ? "User disliked generated tweet pattern" : "");

      if (note) {
        const updates = await refineProfileFromFeedback({
          userId,
          feedbackNote: note,
          currentProfile: profile,
        });

        if (updates.avoid_list?.length || updates.writing_style || updates.personality) {
          await mergeAndSaveProfile(userId, updates);
        } else if (data.feedbackType === "dislike") {
          await mergeAndSaveProfile(userId, {
            avoid_list: ["patterns similar to disliked generation"],
          });
        }
      }
    }

    return { success: true, feedback };
  });
