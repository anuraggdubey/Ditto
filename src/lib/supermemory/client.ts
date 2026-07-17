import Supermemory from "supermemory";

let client: Supermemory | null = null;

export function getSupermemoryClient(): Supermemory {
  if (!client) {
    const apiKey = process.env.SUPERMEMORY_API_KEY;
    if (!apiKey) {
      throw new Error(
        "SUPERMEMORY_API_KEY is not set. Add it to your .env file (see .env.example).",
      );
    }

    const baseURL = process.env.SUPERMEMORY_BASE_URL;
    client = new Supermemory({
      apiKey,
      ...(baseURL ? { baseURL } : {}),
    });
  }
  return client;
}

export const MEMORY_TYPES = {
  VOICE_DNA_PROFILE: "voice_dna_profile",
  CONVERSATION_LOG: "conversation_log",
  TWEET_GENERATION: "tweet_generation",
  FEEDBACK_LOG: "feedback_log",
  INSPIRATION_DATASET: "inspiration_dataset",
} as const;
