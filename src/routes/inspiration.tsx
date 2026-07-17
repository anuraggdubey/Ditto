import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AppNav } from "@/components/AppNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { addCreators, connectX, fetchInspiration, syncInspiration, addManualBookmark } from "@/api/inspiration";
import { useState } from "react";

import { Tweet } from "react-tweet";

function extractTweetId(url?: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:x\.com|twitter\.com)\/(?:#!\/)?\w+\/status\/(\d+)/);
  return match ? match[1] : null;
}

function cleanTweetContent(content: string): string {
  if (!content) return "";
  // If it's a huge CSS dump from Twitter's "Javascript disabled" state, hide it
  if (content.includes("body { -ms-overflow-style") || content.includes("JavaScript is not available.")) {
    return "Raw Twitter UI DOM captured (hidden for readability).";
  }
  
  // Remove markdown image links that clutter the UI
  let cleaned = content.replace(/!\[.*?\]\(.*?\)/g, '');
  // Remove markdown links but keep text
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  
  // Clean up excessive newlines and markdown headers
  cleaned = cleaned.replace(/#+\s/g, '');
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  return cleaned.trim();
}

export const Route = createFileRoute("/inspiration")({
  component: InspirationPage,
});

function InspirationPage() {
  const [handles, setHandles] = useState("");
  const [reason, setReason] = useState("");
  const [xHandle, setXHandle] = useState("");
  const [pasteUrl, setPasteUrl] = useState("");
  const queryClient = useQueryClient();

  const inspirationQuery = useQuery({
    queryKey: ["inspiration"],
    queryFn: () => fetchInspiration(),
  });

  const connectMutation = useMutation({
    mutationFn: () => connectX({ data: { handle: xHandle } }),
    onSuccess: (data) => {
      toast.success(`Connected X account: @${data.inspiration.x_handle}`);
      void queryClient.invalidateQueries({ queryKey: ["inspiration"] });
    },
    onError: (err) => toast.error(err.message),
  });

  const syncMutation = useMutation({
    mutationFn: () => syncInspiration(),
    onSuccess: (data) => {
      if (data.count > 0) {
        toast.success(`Synced ${data.count} new bookmarks from Supermemory!`);
      } else {
        toast.info(`No new bookmarks found in Supermemory.`);
      }
      void queryClient.invalidateQueries({ queryKey: ["inspiration"] });
    },
    onError: (err) => toast.error(err.message),
  });

  const pasteMutation = useMutation({
    mutationFn: async () => {
      const id = extractTweetId(pasteUrl);
      if (!id) throw new Error("Invalid X/Twitter URL");
      await addManualBookmark({ data: { url: pasteUrl, tweet_id: id } });
    },
    onSuccess: () => {
      toast.success("Bookmark added!");
      setPasteUrl("");
      void queryClient.invalidateQueries({ queryKey: ["inspiration"] });
    },
    onError: (err) => toast.error(err.message),
  });

  const addMutation = useMutation({
    mutationFn: () =>
      addCreators({
        data: {
          handles: handles.split(/[,\s]+/).filter(Boolean),
          reason: reason || undefined,
        },
      }),
    onSuccess: () => {
      toast.success("Creators saved to Supermemory");
      setHandles("");
      setReason("");
      void queryClient.invalidateQueries({ queryKey: ["inspiration"] });
    },
    onError: (err) => toast.error(err.message),
  });

  const inspiration = inspirationQuery.data?.inspiration;
  const isConnected = !!inspiration?.x_handle;

  return (
    <div className="min-h-screen bg-paper">
      <AppNav />
      <main className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="font-display text-3xl text-ink">Inspiration layer</h1>
        <p className="mt-2 text-graphite">
          Taste signals stored in Supermemory — structural patterns only, never copied tweets.
        </p>

        <div className="mt-8 grid gap-4">
          <Card className="border-hairline">
            <CardHeader>
              <CardTitle className="text-base">X Bookmark Sync</CardTitle>
              <CardDescription className="text-graphite">
                Sync bookmarks via the Supermemory extension to build your Voice DNA without paying X API fees.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isConnected ? (
                <div className="flex gap-2">
                  <Input
                    placeholder="Your X Handle (e.g. @username)"
                    value={xHandle}
                    onChange={(e) => setXHandle(e.target.value)}
                  />
                  <Button
                    variant="outline"
                    onClick={() => connectMutation.mutate()}
                    disabled={!xHandle.trim() || connectMutation.isPending}
                  >
                    {connectMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Connect"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-signal/10 text-signal">
                      Connected as @{inspiration.x_handle}
                    </Badge>
                  </div>
                  <div className="rounded-md bg-graphite/5 p-4 text-sm text-graphite">
                    <p className="mb-2 font-medium text-ink">How to sync:</p>
                    <ol className="list-decimal space-y-1 pl-4">
                      <li>
                        Install the{" "}
                        <a
                          href="https://chromewebstore.google.com/detail/supermemory/afpgkkipfdpeaflnpoaffkcankadgjfc"
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-ink underline underline-offset-2"
                        >
                          Supermemory Chrome Extension
                        </a>
                      </li>
                      <li>Browse X and save bookmarks using the extension.</li>
                      <li>Click sync below to pull them into your Voice DNA.</li>
                    </ol>
                  </div>
                  <Button
                    onClick={() => syncMutation.mutate()}
                    disabled={syncMutation.isPending}
                    className="bg-ink text-paper hover:bg-signal w-full"
                  >
                    {syncMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {syncMutation.isPending ? "Syncing..." : "Sync Bookmarks from Supermemory"}
                  </Button>

                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-hairline"></div>
                    <span className="flex-shrink-0 px-4 text-xs text-graphite-faint uppercase tracking-wider font-semibold">Or Alternative</span>
                    <div className="flex-grow border-t border-hairline"></div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-graphite font-medium">Fast track: Paste a Tweet link</p>
                    <div className="flex gap-2">
                      <Input
                        placeholder="https://x.com/username/status/123..."
                        value={pasteUrl}
                        onChange={(e) => setPasteUrl(e.target.value)}
                      />
                      <Button
                        variant="secondary"
                        onClick={() => pasteMutation.mutate()}
                        disabled={!pasteUrl.trim() || pasteMutation.isPending}
                      >
                        {pasteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-hairline">
            <CardHeader>
              <CardTitle className="text-base">Admired creators</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                placeholder="@handle1, @handle2"
                value={handles}
                onChange={(e) => setHandles(e.target.value)}
              />
              <Textarea
                placeholder="Why you admire them (optional)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="min-h-[60px]"
              />
              <Button
                onClick={() => addMutation.mutate()}
                disabled={!handles.trim() || addMutation.isPending}
                className="bg-ink text-paper hover:bg-signal"
              >
                {addMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Save to Supermemory"
                )}
              </Button>
            </CardContent>
          </Card>

          {inspirationQuery.isLoading ? (
            <Loader2 className="mx-auto h-6 w-6 animate-spin text-graphite" />
          ) : (
            <Card className="border-hairline">
              <CardHeader>
                <CardTitle className="text-base">Saved inspiration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-ink">Creators</h3>
                    {inspiration?.admired_creators.length ? (
                      <div className="flex flex-wrap gap-2">
                        {inspiration.admired_creators.map((c) => (
                          <Badge key={c.handle} variant="secondary">
                            @{c.handle}
                            {c.reason ? ` — ${c.reason}` : ""}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-graphite">No creators added yet.</p>
                    )}
                  </div>

                  <div>
                    <h3 className="mb-2 text-sm font-medium text-ink">Synced Bookmarks</h3>
                    {inspiration?.bookmarks?.length ? (
                      <div className="space-y-4">
                        {inspiration.bookmarks.map((b) => {
                          const realTweetId = extractTweetId(b.url);
                          return (
                            <div key={b.tweet_id} className="rounded-md border border-hairline bg-paper-faint p-4 text-sm shadow-sm">
                              <div className="mb-3 flex items-center justify-between text-xs text-graphite-faint">
                                <span>Bookmark ID: {b.tweet_id}</span>
                                {b.url && (
                                  <a href={b.url} target="_blank" rel="noreferrer" className="text-signal hover:underline font-medium">
                                    View Original
                                  </a>
                                )}
                              </div>
                              
                              {realTweetId ? (
                                <div className="light flex justify-center bg-white rounded-xl overflow-hidden mb-4 border border-hairline/50">
                                  <Tweet id={realTweetId} />
                                </div>
                              ) : b.content ? (
                                <div className="mb-4 whitespace-pre-wrap text-ink max-h-[300px] overflow-y-auto rounded bg-paper border border-hairline p-3">
                                  {cleanTweetContent(b.content)}
                                </div>
                              ) : null}
                              
                              <div className="rounded-lg bg-graphite/5 p-3 text-sm text-graphite border border-graphite/10">
                                <span className="font-semibold text-ink block mb-1">Extracted Voice DNA Pattern:</span> 
                                {b.extracted_pattern || "Stored securely for pattern analysis."}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-graphite">No bookmarks synced yet.</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
