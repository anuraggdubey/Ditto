import { getSupermemoryClient } from "./client";

export async function searchRelevantContext(
  userId: string,
  query: string,
  limit = 8,
): Promise<string[]> {
  const client = getSupermemoryClient();

  try {
    const profileResult = await client.profile({
      containerTag: userId,
      q: query,
      threshold: 0.1,
    });

    const snippets: string[] = [];

    if (profileResult.profile?.static?.length) {
      snippets.push(...profileResult.profile.static.slice(0, 3));
    }
    if (profileResult.profile?.dynamic?.length) {
      snippets.push(...profileResult.profile.dynamic.slice(0, 3));
    }

    if (profileResult.searchResults?.results?.length) {
      for (const r of profileResult.searchResults.results.slice(0, limit)) {
        if (typeof r === "string") snippets.push(r);
        else if (r && typeof r === "object" && "memory" in r) {
          snippets.push(String((r as { memory: string }).memory));
        }
      }
    }

    if (snippets.length > 0) return [...new Set(snippets)].slice(0, limit);
  } catch {
    // Fall through
  }

  try {
    const search = await client.search.memories({
      q: query,
      containerTag: userId,
      limit,
    });

    return (search.results ?? [])
      .map((r) => r.memory ?? r.chunk ?? "")
      .filter(Boolean)
      .slice(0, limit);
  } catch {
    return [];
  }
}

export async function storeDocument(
  userId: string,
  type: string,
  content: string,
  customId?: string,
): Promise<string> {
  const client = getSupermemoryClient();
  const response = await client.documents.add({
    content,
    containerTag: userId,
    customId,
    metadata: { type },
  });
  return response.id;
}

export async function getMemorySummary(userId: string) {
  const client = getSupermemoryClient();
  const profile = await client.profile({ containerTag: userId });
  return {
    static: profile.profile?.static ?? [],
    dynamic: profile.profile?.dynamic ?? [],
  };
}
