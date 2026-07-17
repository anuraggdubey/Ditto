import { generateText } from "ai";
import { createLLM } from "@/lib/llm/provider";

const PATTERN_EXTRACT_SYSTEM = `You extract structural writing patterns from bookmarked social posts.
Output ONE concise sentence describing hook type, pacing, format, and topic angle ONLY.
Never quote or paraphrase specific phrases from the source.
Never reproduce tweet text verbatim.
Example: "Short contrarian hook → numbered list → punchy closer on AI tooling."`;

export async function extractBookmarkPattern(content: string): Promise<string> {
  if (!content.trim()) {
    return "Structural pattern pending — insufficient content.";
  }

  const model = createLLM();
  const { text } = await generateText({
    model,
    system: PATTERN_EXTRACT_SYSTEM,
    prompt: `Extract the structural pattern from this bookmarked content:\n\n${content.slice(0, 2000)}`,
  });

  return text.trim().replace(/^["']|["']$/g, "") || "Structural pattern extracted.";
}
