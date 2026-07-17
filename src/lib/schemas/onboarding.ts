import { z } from "zod";

export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});

export const onboardingSessionSchema = z.object({
  sessionId: z.string(),
  userId: z.string(),
  mode: z.enum(["text", "voice"]).default("text"),
  language: z.string().default("en"),
  messages: z.array(chatMessageSchema).default([]),
  depth: z.number().default(0),
  complete: z.boolean().default(false),
  profileExtracted: z.boolean().default(false),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type OnboardingSession = z.infer<typeof onboardingSessionSchema>;

export const tweetGenerationSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  topic: z.string(),
  context: z.string().optional(),
  generated_text: z.string(),
  created_at: z.string(),
});

export type TweetGeneration = z.infer<typeof tweetGenerationSchema>;
