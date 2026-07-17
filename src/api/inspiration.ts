import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getOrCreateUserId } from "@/api/auth";
import {
  addAdmiredCreators,
  getInspiration,
} from "@/lib/supermemory/inspiration-store";

export const connectX = createServerFn({ method: "POST" }).handler(async () => {
  return {
    status: "not_configured" as const,
    message:
      "X OAuth bookmark sync is not configured yet. Add admired creators manually for now.",
  };
});

export const syncInspiration = createServerFn({ method: "POST" }).handler(async () => {
  return {
    status: "not_configured" as const,
    message: "Bookmark sync requires X API credentials (Phase 2).",
  };
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
