import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { VoiceDnaProfile } from "@/lib/schemas/voice-dna";
import { isProfileReadyForGeneration } from "@/lib/schemas/voice-dna";
import { ConfidenceRing } from "./ConfidenceRing";

function ChipList({ items, empty = "—" }: { items: string[]; empty?: string }) {
  if (!items.length) {
    return <span className="text-sm text-graphite">{empty}</span>;
  }
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <Badge key={item} variant="secondary" className="font-normal">
          {item}
        </Badge>
      ))}
    </div>
  );
}

export function VoiceDNAProfile({ profile }: { profile: VoiceDnaProfile | null }) {
  if (!profile) {
    return (
      <Card className="border-hairline">
        <CardContent className="py-12 text-center">
          <p className="text-graphite">No Voice DNA profile yet.</p>
          <p className="mt-2 text-sm text-graphite-faint">
            Complete onboarding to build your profile.
          </p>
        </CardContent>
      </Card>
    );
  }

  const ready = isProfileReadyForGeneration(profile);

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-display text-2xl text-ink">Voice DNA Profile</h2>
          <p className="mt-1 text-sm text-graphite">
            Updated {new Date(profile.updated_at).toLocaleString()}
          </p>
          {ready ? (
            <Badge className="mt-2 bg-confirm-tint text-confirm hover:bg-confirm-tint">
              Ready to generate
            </Badge>
          ) : (
            <Badge variant="outline" className="mt-2">
              Needs more onboarding
            </Badge>
          )}
        </div>
        <ConfidenceRing score={profile.confidence_score} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-hairline">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Writing style</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <span className="text-graphite">Tone: </span>
              <ChipList items={profile.writing_style.tone} />
            </div>
            <p>
              <span className="text-graphite">Length:</span> {profile.writing_style.sentence_length}
            </p>
            <p>
              <span className="text-graphite">Formality:</span> {profile.writing_style.formality}
            </p>
            <p>
              <span className="text-graphite">Emoji:</span> {profile.writing_style.emoji_usage}
            </p>
          </CardContent>
        </Card>

        <Card className="border-hairline">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Personality</CardTitle>
          </CardHeader>
          <CardContent>
            <ChipList items={profile.personality} />
          </CardContent>
        </Card>

        <Card className="border-hairline">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Interests & expertise</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="mb-1 text-xs uppercase tracking-wide text-graphite">Interests</p>
              <ChipList items={profile.interests} />
            </div>
            <div>
              <p className="mb-1 text-xs uppercase tracking-wide text-graphite">Expertise</p>
              <ChipList items={profile.expertise} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-hairline">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Audience & goals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="mb-1 text-xs uppercase tracking-wide text-graphite">Audience</p>
              <ChipList items={profile.target_audience} />
            </div>
            <div>
              <p className="mb-1 text-xs uppercase tracking-wide text-graphite">Goals</p>
              <ChipList items={profile.posting_goals} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-hairline md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Opinions & avoid list</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.opinions.length > 0 ? (
              <ul className="space-y-2 text-sm">
                {profile.opinions.map((o, i) => (
                  <li key={i}>
                    <span className="font-medium text-ink">{o.topic}:</span>{" "}
                    <span className="text-graphite">{o.stance}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-graphite">No strong opinions captured yet.</p>
            )}
            <div>
              <p className="mb-1 text-xs uppercase tracking-wide text-graphite">Avoid</p>
              <ChipList items={profile.avoid_list} empty="Nothing specified" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
