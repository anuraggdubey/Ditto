import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Database } from "lucide-react";
import { AppNav } from "@/components/AppNav";
import { VoiceDNAProfile } from "@/components/profile/VoiceDNAProfile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchProfile } from "@/api/profile";
import { fetchMemorySummary } from "@/api/supermemory";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: () => fetchProfile(),
  });

  const memoryQuery = useQuery({
    queryKey: ["memory-summary"],
    queryFn: () => fetchMemorySummary(),
  });

  const profile = profileQuery.data?.profile ?? null;
  const memory = memoryQuery.data;

  return (
    <div className="min-h-screen bg-paper">
      <AppNav />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl text-ink">Your Voice DNA</h1>
            <p className="mt-2 text-graphite">
              Structured profile stored in Supermemory under your session user ID.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/onboarding">Update via onboarding</Link>
          </Button>
        </div>

        {profileQuery.isLoading ? (
          <div className="mt-12 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-graphite" />
          </div>
        ) : (
          <div className="mt-8">
            <VoiceDNAProfile profile={profile} />
          </div>
        )}

        <Card className="mt-10 border-hairline">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Database className="h-4 w-4" />
              Supermemory context
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            {memoryQuery.isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-graphite" />
            ) : (
              <>
                <p className="text-graphite">
                  Connection:{" "}
                  <span className={memory?.connection.ok ? "text-confirm" : "text-signal"}>
                    {memory?.connection.ok ? "Connected" : memory?.connection.message}
                  </span>
                </p>
                <p className="text-xs font-mono-ui text-graphite-faint">
                  containerTag: {memory?.userId ?? "—"}
                </p>
                <div>
                  <p className="mb-1 font-medium text-ink">Static profile memories</p>
                  {memory?.static?.length ? (
                    <ul className="list-inside list-disc text-graphite">
                      {memory.static.slice(0, 5).map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-graphite-faint">None yet — complete onboarding.</p>
                  )}
                </div>
                <div>
                  <p className="mb-1 font-medium text-ink">Dynamic profile memories</p>
                  {memory?.dynamic?.length ? (
                    <ul className="list-inside list-disc text-graphite">
                      {memory.dynamic.slice(0, 5).map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-graphite-faint">None yet.</p>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
