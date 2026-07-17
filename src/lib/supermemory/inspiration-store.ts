import {
  createEmptyInspiration,
  inspirationDatasetSchema,
  type InspirationDataset,
} from "@/lib/schemas/inspiration";
import { extractBookmarkPattern } from "@/lib/llm/inspiration-extractor";
import { getSupermemoryClient, MEMORY_TYPES } from "./client";

const inspirationCache = new Map<string, InspirationDataset>();

function inspirationCustomId(userId: string) {
  return `inspiration-${userId.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 80)}`;
}

function isTwitterDoc(doc: {
  type?: string;
  content?: string | null;
  summary?: string | null;
  title?: string | null;
  metadata?: Record<string, unknown> | null;
}): boolean {
  const type = doc.type;
  const content = (doc.content || doc.summary || "").toLowerCase();
  const title = (doc.title || "").toLowerCase();
  const url = String(
    doc.metadata && typeof doc.metadata === "object" ? doc.metadata.url ?? "" : "",
  ).toLowerCase();
  return (
    type === "tweet" ||
    content.includes("twitter.com") ||
    content.includes("x.com") ||
    title.includes("tweet") ||
    url.includes("twitter.com") ||
    url.includes("x.com")
  );
}

function extractUrlFromDoc(doc: {
  metadata?: Record<string, unknown> | null;
  content?: string | null;
}): string | undefined {
  if (doc.metadata && typeof doc.metadata === "object" && typeof doc.metadata.url === "string") {
    return doc.metadata.url;
  }
  const content = doc.content ?? "";
  const match = content.match(/https?:\/\/(?:x\.com|twitter\.com)\/\S+/i);
  return match?.[0];
}

export async function getInspiration(userId: string): Promise<InspirationDataset> {
  const cached = inspirationCache.get(userId);
  if (cached) return cached;

  const client = getSupermemoryClient();
  const customId = inspirationCustomId(userId);

  try {
    const doc = await client.documents.get(customId);
    if (doc.content) {
      const parsed = inspirationDatasetSchema.parse(JSON.parse(doc.content));
      inspirationCache.set(userId, parsed);
      return parsed;
    }
  } catch {
    // No inspiration yet
  }

  const empty = createEmptyInspiration(userId);
  inspirationCache.set(userId, empty);
  return empty;
}

export async function saveInspiration(
  dataset: InspirationDataset,
): Promise<InspirationDataset> {
  const client = getSupermemoryClient();
  const validated = inspirationDatasetSchema.parse({
    ...dataset,
    last_synced: dataset.last_synced ?? new Date().toISOString(),
  });
  const content = JSON.stringify(validated, null, 2);
  const customId = inspirationCustomId(validated.user_id);

  try {
    await client.documents.update(customId, {
      content,
      metadata: { type: MEMORY_TYPES.INSPIRATION_DATASET },
    });
  } catch {
    await client.documents.add({
      content,
      containerTag: validated.user_id,
      customId,
      metadata: { type: MEMORY_TYPES.INSPIRATION_DATASET },
    });
  }

  inspirationCache.set(validated.user_id, validated);
  return validated;
}

export async function addAdmiredCreators(
  userId: string,
  handles: string[],
  reason?: string,
): Promise<InspirationDataset> {
  const existing = await getInspiration(userId);
  const newCreators = handles
    .map((h) => h.replace(/^@/, "").trim())
    .filter(Boolean)
    .map((handle) => ({ handle, reason }));

  const mergedHandles = new Set(existing.admired_creators.map((c) => c.handle));
  const admired_creators = [
    ...existing.admired_creators,
    ...newCreators.filter((c) => !mergedHandles.has(c.handle)),
  ];

  return saveInspiration({
    ...existing,
    admired_creators,
    last_synced: new Date().toISOString(),
  });
}

export async function getInspirationPatterns(userId: string): Promise<string[]> {
  const inspiration = await getInspiration(userId);
  const patterns: string[] = [];

  for (const bookmark of inspiration.bookmarks) {
    if (bookmark.extracted_pattern) {
      patterns.push(bookmark.extracted_pattern);
    }
  }

  for (const creator of inspiration.admired_creators) {
    patterns.push(
      `Admires @${creator.handle}${creator.reason ? `: ${creator.reason}` : ""} — study structural patterns (hooks, pacing), never copy phrasing`,
    );
  }

  return patterns;
}

const PLACEHOLDER_PATTERNS = [
  "pending extraction",
  "saved manually",
  "pattern extracted from bookmark",
];

function needsPatternExtraction(pattern?: string): boolean {
  if (!pattern) return true;
  const lower = pattern.toLowerCase();
  return PLACEHOLDER_PATTERNS.some((p) => lower.includes(p));
}

export async function syncTwitterBookmarksToSupermemory(
  userId: string,
): Promise<{ inspiration: InspirationDataset; count: number }> {
  const existing = await getInspiration(userId);
  const client = getSupermemoryClient();

  let docs: Array<{
    id?: string;
    type?: string;
    content?: string | null;
    summary?: string | null;
    title?: string | null;
    metadata?: Record<string, unknown> | null;
  }> = [];

  try {
    const listRes = await client.documents.list({
      limit: 100,
      includeContent: true,
      containerTags: [userId],
    });
    docs = listRes.memories ?? [];
  } catch (err) {
    console.error("Failed to list Supermemory documents for user", userId, err);
  }

  if (docs.length === 0) {
    try {
      const searchRes = await client.search.documents({
        q: "twitter x.com bookmark tweet",
        containerTag: userId,
        limit: 50,
      });
      docs = searchRes.results.map((r) => ({
        id: r.documentId,
        type: r.type ?? undefined,
        content: r.chunks?.[0]?.content ?? null,
        summary: r.title,
        title: r.title,
        metadata: r.metadata as Record<string, unknown> | null,
      }));
    } catch (err) {
      console.error("Failed to search Supermemory bookmarks", err);
    }
  }

  const twitterDocs = docs.filter(isTwitterDoc);
  const existingBookmarksMap = new Map(existing.bookmarks.map((b) => [b.tweet_id, b]));
  let patternsExtracted = 0;

  for (const doc of twitterDocs) {
    const id = doc.id;
    if (!id) continue;

    const prev = existingBookmarksMap.get(id);
    const content = doc.content || doc.summary || prev?.content;
    const url = extractUrlFromDoc(doc) || prev?.url;

    let extracted_pattern = prev?.extracted_pattern;
    if (content && needsPatternExtraction(extracted_pattern) && patternsExtracted < 5) {
      try {
        extracted_pattern = await extractBookmarkPattern(content);
        patternsExtracted += 1;
      } catch (err) {
        console.error("Pattern extraction failed for bookmark", id, err);
        extracted_pattern =
          extracted_pattern ?? "Bookmark from X — structural pattern pending.";
      }
    }

    existingBookmarksMap.set(id, {
      tweet_id: id,
      synced_at: prev?.synced_at ?? new Date().toISOString(),
      extracted_pattern,
      content,
      url,
    });
  }

  const updatedBookmarks = Array.from(existingBookmarksMap.values());
  const newCount = updatedBookmarks.filter(
    (b) => !existing.bookmarks.some((e) => e.tweet_id === b.tweet_id),
  ).length;

  const hasUpdates =
    newCount > 0 ||
    updatedBookmarks.some(
      (b) =>
        !existing.bookmarks.find(
          (e) =>
            e.tweet_id === b.tweet_id &&
            e.content === b.content &&
            e.extracted_pattern === b.extracted_pattern,
        ),
    );

  if (hasUpdates) {
    const updated = await saveInspiration({
      ...existing,
      bookmarks: updatedBookmarks,
      last_synced: new Date().toISOString(),
    });
    return { inspiration: updated, count: newCount > 0 ? newCount : patternsExtracted };
  }

  const updated = await saveInspiration({
    ...existing,
    last_synced: new Date().toISOString(),
  });
  return { inspiration: updated, count: 0 };
}

export async function addManualBookmarkWithPattern(
  userId: string,
  url: string,
  tweetId: string,
): Promise<InspirationDataset> {
  const inspiration = await getInspiration(userId);

  if (inspiration.bookmarks.some((b) => b.tweet_id === tweetId)) {
    return inspiration;
  }

  let extracted_pattern = "Saved manually. Pending extraction.";
  try {
    extracted_pattern = await extractBookmarkPattern(`Bookmarked tweet URL: ${url}`);
  } catch {
    // Keep placeholder
  }

  inspiration.bookmarks.push({
    tweet_id: tweetId,
    url,
    synced_at: new Date().toISOString(),
    extracted_pattern,
  });

  return saveInspiration(inspiration);
}
