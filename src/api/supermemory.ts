import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { SupermemoryService } from "@/lib/supermemory/service";
import { getOrCreateUserId } from "@/api/auth";

export const checkSupermemory = createServerFn({ method: "GET" }).handler(async () => {
  return SupermemoryService.checkConnection();
});

export const fetchUserMemoryContext = createServerFn({ method: "GET" })
  .validator(z.object({ q: z.string().optional() }).optional())
  .handler(async ({ data }) => {
    const userId = getOrCreateUserId();
    const context = await SupermemoryService.getUserContext(userId, data?.q);
    return context;
  });

export const fetchMemorySummary = createServerFn({ method: "GET" }).handler(async () => {
  const userId = getOrCreateUserId();
  const summary = await SupermemoryService.getMemorySummary(userId);
  const connection = await SupermemoryService.checkConnection();
  return { userId, ...summary, connection };
});
