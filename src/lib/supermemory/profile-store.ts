import {
  createEmptyProfile,
  mergeProfiles,
  voiceDnaProfileSchema,
  type VoiceDnaProfile,
} from "@/lib/schemas/voice-dna";
import { getSupermemoryClient, MEMORY_TYPES } from "./client";

const profileCache = new Map<string, VoiceDnaProfile>();
const profileDocIds = new Map<string, string>();

function profileCustomId(userId: string) {
  return `voice-dna-${userId.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 80)}`;
}

export async function getProfile(userId: string): Promise<VoiceDnaProfile | null> {
  const cached = profileCache.get(userId);
  if (cached) return cached;

  const client = getSupermemoryClient();
  const customId = profileCustomId(userId);

  try {
    const doc = await client.documents.get(customId);
    if (doc.content) {
      const parsed = voiceDnaProfileSchema.parse(JSON.parse(doc.content));
      profileCache.set(userId, parsed);
      profileDocIds.set(userId, doc.id ?? customId);
      return parsed;
    }
  } catch {
    // Fall through to search
  }

  try {
    const search = await client.search.memories({
      q: "voice dna profile structured json",
      containerTag: userId,
      limit: 5,
    });

    for (const result of search.results ?? []) {
      const memory = result.memory ?? result.chunk;
      if (!memory) continue;
      try {
        const jsonMatch = memory.match(/\{[\s\S]*"user_id"[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = voiceDnaProfileSchema.parse(JSON.parse(jsonMatch[0]));
          profileCache.set(userId, parsed);
          return parsed;
        }
      } catch {
        continue;
      }
    }
  } catch {
    // No profile yet
  }

  return null;
}

export async function saveProfile(profile: VoiceDnaProfile): Promise<VoiceDnaProfile> {
  const client = getSupermemoryClient();
  const validated = voiceDnaProfileSchema.parse({
    ...profile,
    updated_at: new Date().toISOString(),
  });
  const content = JSON.stringify(validated, null, 2);
  const customId = profileCustomId(validated.user_id);

  const existingDocId = profileDocIds.get(validated.user_id);
  if (existingDocId) {
    try {
      await client.documents.update(existingDocId, {
        content,
        metadata: { type: MEMORY_TYPES.VOICE_DNA_PROFILE },
      });
      profileCache.set(validated.user_id, validated);
      return validated;
    } catch {
      profileDocIds.delete(validated.user_id);
    }
  }

  const response = await client.documents.add({
    content,
    containerTag: validated.user_id,
    customId,
    metadata: { type: MEMORY_TYPES.VOICE_DNA_PROFILE },
  });

  profileDocIds.set(validated.user_id, response.id);
  profileCache.set(validated.user_id, validated);

  await client.add({
    content: `Voice DNA profile updated for user. Tone: ${validated.writing_style.tone.join(", ")}. Audience: ${validated.target_audience.join(", ")}.`,
    containerTag: validated.user_id,
    metadata: { type: MEMORY_TYPES.VOICE_DNA_PROFILE, summary: "true" },
  });

  return validated;
}

export async function mergeAndSaveProfile(
  userId: string,
  updates: Partial<VoiceDnaProfile>,
): Promise<VoiceDnaProfile> {
  const existing = (await getProfile(userId)) ?? createEmptyProfile(userId);
  const merged = mergeProfiles(existing, updates);
  return saveProfile(merged);
}

export async function patchProfile(
  userId: string,
  updates: Partial<VoiceDnaProfile>,
): Promise<VoiceDnaProfile> {
  return mergeAndSaveProfile(userId, updates);
}
