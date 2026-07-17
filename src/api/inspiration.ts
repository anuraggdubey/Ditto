import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getOrCreateUserId } from "@/api/auth";
import {
  addAdmiredCreators,
  getInspiration,
  saveInspiration,
  syncTwitterBookmarksToSupermemory,
} from "@/lib/supermemory/inspiration-store";

export const connectX = createServerFn({ method: "POST" })
  .validator(z.object({ handle: z.string() }))
  .handler(async ({ data }) => {
    const userId = getOrCreateUserId();
    const inspiration = await getInspiration(userId);
    inspiration.x_handle = data.handle.replace(/^@/, "").trim();
    await saveInspiration(inspiration);
    return { status: "connected" as const, inspiration };
  });

export const syncInspiration = createServerFn({ method: "POST" }).handler(async () => {
  const userId = getOrCreateUserId();
  const { inspiration, count } = await syncTwitterBookmarksToSupermemory(userId);
  return { status: "synced" as const, inspiration, count };
});

export const addCreators = createServerFn({ method: "POST" })
  .validator(
    z.object({
      handles: z.array(z.string()).min(1),
      reason: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const userId = getOrCreateUserId();
    const inspiration = await addAdmiredCreators(userId, data.handles, data.reason);
    return { inspiration };
  });

export const fetchInspiration = createServerFn({ method: "GET" }).handler(async () => {
  const userId = getOrCreateUserId();
  const inspiration = await getInspiration(userId);
  return { inspiration, userId };
});

export const addManualBookmark = createServerFn({ method: "POST" })
  .validator(z.object({ url: z.string(), tweet_id: z.string() }))
  .handler(async ({ data }) => {
    const userId = getOrCreateUserId();
    const inspiration = await getInspiration(userId);
    
    // Check if it already exists
    if (!inspiration.bookmarks.some((b) => b.tweet_id === data.tweet_id)) {
      inspiration.bookmarks.push({
        tweet_id: data.tweet_id,
        url: data.url,
        synced_at: new Date().toISOString(),
        extracted_pattern: "Saved manually. Pending extraction.",
      });
      await saveInspiration(inspiration);
    }
    
    return { success: true };
  });
