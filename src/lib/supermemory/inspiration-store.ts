import {
  createEmptyInspiration,
  inspirationDatasetSchema,
  type InspirationDataset,
} from "@/lib/schemas/inspiration";
import { getSupermemoryClient, MEMORY_TYPES } from "./client";

const inspirationCache = new Map<string, InspirationDataset>();

function inspirationCustomId(userId: string) {
  return `inspiration-${userId.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 80)}`;
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

export async function syncTwitterBookmarksToSupermemory(userId: string): Promise<{ inspiration: InspirationDataset, count: number }> {
  const existing = await getInspiration(userId);
  const client = getSupermemoryClient();
  
  // List all recent documents in the user's supermemory
  let docs: any[] = [];
  try {
    const listRes = await client.documents.list({
      limit: 100,
      includeContent: true,
    });
    docs = (listRes as any).memories || (listRes as any).data || (listRes as any).results || [];
  } catch (err) {
    console.error("Failed to list Supermemory bookmarks", err);
  }

  // Filter docs for twitter.com or x.com
  const twitterDocs = docs.filter(d => {
    const type = d.type || (d.metadata && typeof d.metadata === "object" ? (d.metadata as any).type : undefined);
    const content = (d.content || d.summary || "").toLowerCase();
    const title = (d.title || "").toLowerCase();
    const url = ((d.metadata && typeof d.metadata === "object" ? (d.metadata as any).url : "") || "").toLowerCase();
    return type === "tweet" || content.includes("twitter.com") || content.includes("x.com") || title.includes("tweet") || url.includes("twitter.com") || url.includes("x.com");
  });

  const existingBookmarksMap = new Map(existing.bookmarks.map(b => [b.tweet_id, b]));

  for (const doc of twitterDocs) {
    const id = doc.id || doc.documentId;
    if (!id) continue;
    
    const docUrl = doc.metadata && typeof doc.metadata === "object" ? (doc.metadata as any).url : undefined;
    const extracted = doc.summary || doc.content ? `Pattern extracted from bookmark: ${doc.title || id}. Core topic or structure: ${(doc.summary || doc.content || "").substring(0, 100)}...` : undefined;
    const content = doc.content || doc.summary || undefined;
    
    existingBookmarksMap.set(id, {
      tweet_id: id,
      synced_at: existingBookmarksMap.get(id)?.synced_at || new Date().toISOString(),
      extracted_pattern: extracted || existingBookmarksMap.get(id)?.extracted_pattern,
      content: content || existingBookmarksMap.get(id)?.content,
      url: docUrl || existingBookmarksMap.get(id)?.url,
    });
  }
  
  const updatedBookmarks = Array.from(existingBookmarksMap.values());
  const newCount = updatedBookmarks.length - existing.bookmarks.length;

  if (newCount > 0 || updatedBookmarks.some(b => !existing.bookmarks.find(e => e.tweet_id === b.tweet_id && e.content === b.content))) {
    const updated = await saveInspiration({
      ...existing,
      bookmarks: updatedBookmarks,
      last_synced: new Date().toISOString(),
    });
    // Return count of *new* bookmarks, but at least 1 if we backfilled content so the toast shows success
    return { inspiration: updated, count: newCount > 0 ? newCount : 1 };
  }

  const updated = await saveInspiration({
    ...existing,
    last_synced: new Date().toISOString(),
  });
  return { inspiration: updated, count: 0 };
}
