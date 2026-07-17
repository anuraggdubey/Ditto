/**
 * Unified Supermemory facade for Voice DNA.
 *
 * Each user maps to one Supermemory container via `containerTag = userId`.
 * This mirrors the Pipecat integration pattern where `user_id` scopes all memory:
 * https://supermemory.ai/docs/integrations/pipecat
 */
import type { VoiceDnaProfile } from "@/lib/schemas/voice-dna";
import { getSupermemoryClient, MEMORY_TYPES } from "./client";
import { getMemorySummary, searchRelevantContext, storeDocument } from "./memory-search";
import {
  getProfile,
  mergeAndSaveProfile,
  patchProfile,
  saveProfile,
} from "./profile-store";
import {
  addAdmiredCreators,
  getInspiration,
  getInspirationPatterns,
  saveInspiration,
} from "./inspiration-store";

export type SupermemoryUserContext = {
  userId: string;
  staticProfile: string[];
  dynamicProfile: string[];
  structuredProfile: VoiceDnaProfile | null;
};

/** Verify API key and return connection status. */
export async function checkSupermemoryConnection(): Promise<{
  ok: boolean;
  message: string;
}> {
  try {
    const client = getSupermemoryClient();
    await client.settings.get();
    return { ok: true, message: "Connected to Supermemory API" };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { ok: false, message };
  }
}

/** Load full user context — profile API + structured Voice DNA document. */
export async function getUserContext(
  userId: string,
  searchQuery?: string,
): Promise<SupermemoryUserContext> {
  const [summary, structuredProfile] = await Promise.all([
    getMemorySummary(userId),
    getProfile(userId),
  ]);

  if (searchQuery) {
    const extra = await searchRelevantContext(userId, searchQuery, 5);
    return {
      userId,
      staticProfile: [...summary.static, ...extra.slice(0, 2)],
      dynamicProfile: summary.dynamic,
      structuredProfile,
    };
  }

  return {
    userId,
    staticProfile: summary.static,
    dynamicProfile: summary.dynamic,
    structuredProfile,
  };
}

/** Store a conversational memory (transcript snippet, feedback note, etc.). */
export async function addUserMemory(
  userId: string,
  content: string,
  metadata: Record<string, string | number | boolean | string[]> = {},
): Promise<string> {
  const client = getSupermemoryClient();
  const response = await client.add({
    content,
    containerTag: userId,
    metadata,
  });
  return response.id;
}

/** Semantic search scoped to user container. */
export async function searchUserMemories(
  userId: string,
  query: string,
  limit = 10,
): Promise<string[]> {
  return searchRelevantContext(userId, query, limit);
}

export const SupermemoryService = {
  checkConnection: checkSupermemoryConnection,
  getUserContext,
  getProfile,
  saveProfile,
  patchProfile,
  mergeAndSaveProfile,
  addUserMemory,
  searchUserMemories,
  storeDocument,
  getMemorySummary,
  getInspiration,
  saveInspiration,
  addAdmiredCreators,
  getInspirationPatterns,
  MEMORY_TYPES,
};
