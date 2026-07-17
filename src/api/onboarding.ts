import { randomUUID } from "node:crypto";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { OnboardingSession } from "@/lib/schemas/onboarding";
import { onboardingSessionSchema } from "@/lib/schemas/onboarding";
import { getOrCreateUserId } from "@/api/auth";
import {
  extractProfileFromTranscript,
  generateOnboardingReply,
} from "@/lib/llm/profile-extractor";

const sessions = new Map<string, OnboardingSession>();

const ONBOARDING_COMPLETE_MARKER = "[ONBOARDING_COMPLETE]";

export const startOnboardingSession = createServerFn({ method: "POST" })
  .validator(
    z.object({
      mode: z.enum(["text", "voice"]).default("text"),
      language: z.string().default("en"),
    }),
  )
  .handler(async ({ data }) => {
    const userId = getOrCreateUserId();
    const sessionId = randomUUID();

    const session: OnboardingSession = onboardingSessionSchema.parse({
      sessionId,
      userId,
      mode: data.mode,
      language: data.language,
      messages: [],
      depth: 0,
      complete: false,
      profileExtracted: false,
    });

    const greeting =
      data.mode === "voice"
        ? "Voice onboarding via Pipecat is coming soon. For now, let's chat by text — tell me what you usually post about on X."
        : "Hey! I'm Voice DNA. I'll learn how you write through a quick conversation — not a form. What do you usually post about on X?";

    session.messages.push({ role: "assistant", content: greeting });
    sessions.set(sessionId, session);

    return {
      sessionId,
      userId,
      message: greeting,
      complete: false,
      profileExtracted: false,
    };
  });

export const sendOnboardingMessage = createServerFn({ method: "POST" })
  .validator(
    z.object({
      sessionId: z.string(),
      message: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    const userId = getOrCreateUserId();
    const session = sessions.get(data.sessionId);

    if (!session) {
      throw new Error("Onboarding session not found. Please start a new session.");
    }

    if (session.userId !== userId) {
      throw new Error("Session does not belong to current user.");
    }

    session.messages.push({ role: "user", content: data.message });
    session.depth += 1;

    const userWantsDone =
      /\b(done|finish|complete|that's all|thats all|i'm done|im done)\b/i.test(
        data.message,
      );

    let assistantText = await generateOnboardingReply(session.messages);
    const isComplete =
      assistantText.includes(ONBOARDING_COMPLETE_MARKER) ||
      userWantsDone ||
      session.depth >= 8;

    assistantText = assistantText.replace(ONBOARDING_COMPLETE_MARKER, "").trim();

    session.messages.push({ role: "assistant", content: assistantText });
    session.complete = isComplete;

    let profileExtracted = session.profileExtracted;

    if (isComplete && !session.profileExtracted) {
      await extractProfileFromTranscript({
        userId: session.userId,
        sessionId: session.sessionId,
        mode: session.mode,
        language: session.language,
        messages: session.messages,
      });
      session.profileExtracted = true;
      profileExtracted = true;
    }

    sessions.set(data.sessionId, session);

    return {
      message: assistantText,
      complete: session.complete,
      profileExtracted,
      depth: session.depth,
    };
  });

export const getOnboardingSession = createServerFn({ method: "GET" })
  .validator(z.object({ sessionId: z.string() }))
  .handler(async ({ data }) => {
    const session = sessions.get(data.sessionId);
    if (!session) return null;
    return {
      sessionId: session.sessionId,
      messages: session.messages,
      complete: session.complete,
      profileExtracted: session.profileExtracted,
      depth: session.depth,
      mode: session.mode,
    };
  });
