import { z } from "zod";

export const admiredCreatorSchema = z.object({
  handle: z.string(),
  reason: z.string().optional(),
});

export const inspirationDatasetSchema = z.object({
  user_id: z.string(),
  bookmarks: z
    .array(
      z.object({
        tweet_id: z.string(),
        synced_at: z.string(),
        extracted_pattern: z.string().optional(),
        content: z.string().optional(),
        url: z.string().optional(),
      }),
    )
    .default([]),
  saved_posts: z
    .array(
      z.object({
        tweet_id: z.string(),
        synced_at: z.string(),
      }),
    )
    .default([]),
  admired_creators: z.array(admiredCreatorSchema).default([]),
  x_handle: z.string().nullable().default(null),
  last_synced: z.string().nullable().default(null),
});

export type InspirationDataset = z.infer<typeof inspirationDatasetSchema>;
export type AdmiredCreator = z.infer<typeof admiredCreatorSchema>;

export function createEmptyInspiration(userId: string): InspirationDataset {
  return inspirationDatasetSchema.parse({ user_id: userId });
}
