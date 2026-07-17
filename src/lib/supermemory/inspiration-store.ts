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
