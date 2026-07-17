import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2, Mic, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { AppNav } from "@/components/AppNav";
import { ChatThread } from "@/components/onboarding/ChatThread";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  sendOnboardingMessage,
  startOnboardingSession,
} from "@/api/onboarding";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingPage,
});

function OnboardingPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([]);
  const [input, setInput] = useState("");
  const [complete, setComplete] = useState(false);
  const [profileExtracted, setProfileExtracted] = useState(false);

  const startMutation = useMutation({
    mutationFn: (mode: "text" | "voice") =>
      startOnboardingSession({ data: { mode, language: "en" } }),
    onSuccess: (data) => {
      setSessionId(data.sessionId);
      setMessages([{ role: "assistant", content: data.message }]);
      setComplete(false);
      setProfileExtracted(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const sendMutation = useMutation({
    mutationFn: (message: string) =>
      sendOnboardingMessage({ data: { sessionId: sessionId!, message } }),
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);
      setComplete(data.complete);
      setProfileExtracted(data.profileExtracted);
      if (data.profileExtracted) {
        toast.success("Voice DNA saved to Supermemory");
      }
    },
    onError: (err) => toast.error(err.message),
  });

  const handleSend = () => {
    const text = input.trim();
    if (!text || !sessionId) return;
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    sendMutation.mutate(text);
  };

  return (
    <div className="min-h-screen bg-paper">
      <AppNav />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="font-display text-3xl text-ink">Voice DNA Onboarding</h1>
        <p className="mt-2 text-graphite">
          Conversational intake — your profile is extracted and stored in{" "}
          <a
            href="https://supermemory.ai/docs"
            className="text-signal underline"
            target="_blank"
            rel="noreferrer"
          >
            Supermemory
          </a>{" "}
          per user.
        </p>

        <Tabs defaultValue="text" className="mt-8">
          <TabsList>
            <TabsTrigger value="text" className="gap-1.5">
              <MessageSquare className="h-4 w-4" />
              Text
            </TabsTrigger>
            <TabsTrigger value="voice" className="gap-1.5">
              <Mic className="h-4 w-4" />
              Voice
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="mt-6 space-y-4">
            {!sessionId ? (
              <Button
                onClick={() => startMutation.mutate("text")}
                disabled={startMutation.isPending}
                className="bg-ink text-paper hover:bg-signal"
              >
                {startMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Start text onboarding
              </Button>
            ) : (
              <>
                <ChatThread messages={messages} />
                {!complete && (
                  <div className="flex gap-2">
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type your answer…"
                      className="min-h-[80px]"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                    />
                    <Button
                      onClick={handleSend}
                      disabled={sendMutation.isPending || !input.trim()}
                      className="shrink-0 self-end bg-ink text-paper hover:bg-signal"
                    >
                      {sendMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Send"
                      )}
                    </Button>
                  </div>
                )}
                {complete && profileExtracted && (
                  <div className="rounded-lg border border-confirm/30 bg-confirm-tint p-4">
                    <p className="font-medium text-confirm">Profile saved to Supermemory</p>
                    <p className="mt-1 text-sm text-graphite">
                      Your Voice DNA is ready. Generate a tweet or view your profile.
                    </p>
                    <div className="mt-4 flex gap-2">
                      <Button asChild className="bg-ink text-paper hover:bg-signal">
                        <Link to="/generate">Generate tweet</Link>
                      </Button>
                      <Button asChild variant="outline">
                        <Link to="/profile">View profile</Link>
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="voice" className="mt-6">
            <div className="rounded-lg border border-hairline bg-paper-raised p-8 text-center">
              <Mic className="mx-auto h-10 w-10 text-graphite-faint" />
              <h3 className="mt-4 font-medium text-ink">Voice mode — coming soon</h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-graphite">
                Pipecat + Supermemory voice pipeline will use the same{" "}
                <code className="rounded bg-paper px-1 font-mono-ui text-xs">user_id</code>{" "}
                container. See{" "}
                <a
                  href="https://supermemory.ai/docs/integrations/pipecat"
                  className="text-signal underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  Supermemory × Pipecat docs
                </a>
                .
              </p>
              <Button
                className="mt-6"
                variant="outline"
                onClick={() => startMutation.mutate("text")}
              >
                Use text onboarding instead
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
