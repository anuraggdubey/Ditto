import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AppNav } from "@/components/AppNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addCreators, connectX, fetchInspiration, syncInspiration } from "@/api/inspiration";
import { useState } from "react";

export const Route = createFileRoute("/inspiration")({
  component: InspirationPage,
});

function InspirationPage() {
  const [handles, setHandles] = useState("");
  const [reason, setReason] = useState("");
  const queryClient = useQueryClient();

  const inspirationQuery = useQuery({
    queryKey: ["inspiration"],
    queryFn: () => fetchInspiration(),
  });

  const connectMutation = useMutation({
    mutationFn: () => connectX(),
    onSuccess: (data) => toast.info(data.message),
  });

  const syncMutation = useMutation({
    mutationFn: () => syncInspiration(),
    onSuccess: (data) => toast.info(data.message),
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
              <CardTitle className="text-base">Connect X</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => connectMutation.mutate()}
                disabled={connectMutation.isPending}
              >
                Connect X (OAuth)
              </Button>
              <Button
                variant="outline"
                onClick={() => syncMutation.mutate()}
                disabled={syncMutation.isPending}
              >
                Sync bookmarks
              </Button>
              <p className="w-full text-xs text-graphite-faint">
                Phase 2 — bookmark sync uses X API. Manual creators work today.
              </p>
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
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
