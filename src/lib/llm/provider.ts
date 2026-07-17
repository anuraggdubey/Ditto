import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { createGroq } from "@ai-sdk/groq";
import type { LanguageModel } from "ai";

export type LlmProvider = "anthropic" | "openai" | "groq";

export function getLlmProvider(): LlmProvider {
  const provider = process.env.LLM_PROVIDER?.toLowerCase();
  if (provider === "openai") return "openai";
  if (provider === "groq") return "groq";
  return "anthropic";
}

export function createLLM(): LanguageModel {
  const provider = getLlmProvider();

  if (provider === "groq") {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY is not set. Add it to your .env file.");
    }
    const groq = createGroq({
      apiKey,
    });
    return groq(process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile");
  }

  if (provider === "openai") {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not set. Add it to your .env file.");
    }
    return openai(process.env.OPENAI_MODEL ?? "gpt-4o");
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not set. Add it to your .env file.");
  }
  return anthropic(process.env.ANTHROPIC_MODEL ?? "claude-3-5-sonnet-20240620");
}
