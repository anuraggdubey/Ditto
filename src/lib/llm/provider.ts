import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";

export type LlmProvider = "anthropic" | "openai";

export function getLlmProvider(): LlmProvider {
  const provider = process.env.LLM_PROVIDER?.toLowerCase();
  if (provider === "openai") return "openai";
  return "anthropic";
}

export function createLLM(): LanguageModel {
  const provider = getLlmProvider();

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
  return anthropic(process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-20250514");
}
