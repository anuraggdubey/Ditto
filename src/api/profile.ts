import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { voiceDnaProfileSchema } from "@/lib/schemas/voice-dna";
import { getOrCreateUserId } from "@/api/auth";
import { getProfile, patchProfile } from "@/lib/supermemory/profile-store";

export const fetchProfile = createServerFn({ method: "GET" }).handler(async () => {
  const userId = getOrCreateUserId();
  const profile = await getProfile(userId);
  return { profile, userId };
});

export const updateProfile = createServerFn({ method: "POST" })
  .validator(voiceDnaProfileSchema.partial())
  .handler(async ({ data }) => {
    const userId = getOrCreateUserId();
    const updated = await patchProfile(userId, data);
    return { profile: updated };
  });
