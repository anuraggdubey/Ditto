import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Copy, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AppNav } from "@/components/AppNav";
import { FeedbackBar } from "@/components/generate/FeedbackBar";
import { TweetCharCount, TweetEditor } from "@/components/generate/TweetEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { fetchProfile } from "@/api/profile";
import { generateTweet, submitFeedback } from "@/api/tweet";
import { isProfileReadyForGeneration } from "@/lib/schemas/voice-dna";

export const Route = createFileRoute("/generate")({
  component: GeneratePage,
});

function GeneratePage() {
  const [topic, setTopic] = useState("");
  const [context, setContext] = useState("");
  const [tweet, setTweet] = useState("");
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);

  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: () => fetchProfile(),
  });

  const generateMutation = useMutation({
    mutationFn: () => generateTweet({ data: { topic, context: context || undefined } }),
    onSuccess: (data) => {
      setTweet(data.tweet);
      setGenerationId(data.generationId);
      setEditing(false);
      setFeedbackSent(false);
      toast.success("Tweet generated with Supermemory context");
    },
    onError: (err) => toast.error(err.message),
  });

  const feedbackMutation = useMutation({
    mutationFn: (params: {
      type: "like" | "dislike" | "edit" | "custom";
      finalText?: string;
      customNote?: string;
    }) =>
      submitFeedback({
        data: {
          generationId: generationId!,
          generatedText: tweet,
          feedbackType: params.type,
          finalText: params.finalText,
          customNote: params.customNote,
        },
      }),
    onSuccess: () => {
      setFeedbackSent(true);
      toast.success("Feedback saved to Supermemory");
    },
    onError: (err) => toast.error(err.message),
  });

  const profile = profileQuery.data?.profile ?? null;
  const ready = profile ? isProfileReadyForGeneration(profile) : false;

  const copyTweet = () => {
    void navigator.clipboard.writeText(tweet);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="min-h-screen bg-paper">
      <AppNav />
      <main className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="font-display text-3xl text-ink">Generate tweet</h1>
        <p className="mt-2 text-sm text-graphite">
          Uses your Voice DNA profile + Supermemory retrieval for context.
        </p>

        {!profile && !profileQuery.isLoading && (
          <div className="mt-6 rounded-lg border border-signal/30 bg-signal-tint p-4">
            <p className="text-sm text-ink">
              Complete{" "}
              <Link to="/onboarding" className="font-medium text-signal underline">
                onboarding
              </Link>{" "}
              first to build your Supermemory profile.
            </p>
          </div>
        )}

        {profile && !ready && (
          <div className="mt-6 rounded-lg border border-hairline bg-paper-raised p-4 text-sm text-graphite">
            Profile needs tone, audience, and at least one interest.{" "}
            <Link to="/onboarding" className="text-signal underline">
              Continue onboarding
            </Link>
          </div>
        )}

        <div className="mt-8 space-y-4">
          <div>
            <label className="text-sm font-medium text-ink">Topic</label>
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="What do you want to post about?"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink">Context (optional)</label>
            <Textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Link, update, or angle…"
              className="mt-1 min-h-[80px]"
            />
          </div>

          <Button
            onClick={() => generateMutation.mutate()}
            disabled={!topic.trim() || !ready || generateMutation.isPending}
            className="gap-2 bg-ink text-paper hover:bg-signal"
          >
            {generateMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            Generate
          </Button>

          {tweet && (
            <div className="space-y-4 border-t border-hairline pt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-ink">Generated tweet</span>
                <div className="flex items-center gap-2">
                  <TweetCharCount text={editing ? tweet : tweet} />
                  <Button type="button" variant="ghost" size="sm" onClick={copyTweet}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditing(!editing)}
                  >
                    Edit
                  </Button>
                </div>
              </div>
              <TweetEditor
                value={tweet}
                editable={editing}
                onChange={setTweet}
              />
              {!feedbackSent && generationId && (
                <FeedbackBar
                  disabled={feedbackMutation.isPending}
                  onFeedback={(params) => {
                    if (params.type === "edit" && params.finalText) {
                      setTweet(params.finalText);
                    }
                    feedbackMutation.mutate(params);
                  }}
                />
              )}
              {feedbackSent && (
                <p className="text-sm text-confirm">Thanks — feedback stored in Supermemory.</p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
