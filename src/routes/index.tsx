import { createFileRoute } from "@tanstack/react-router";
import { SignatureLine } from "@/components/SignatureLine";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex h-7 w-7 items-center justify-center rounded-md bg-ink">
        <span className="font-display text-[18px] leading-none text-paper" style={{ fontWeight: 500 }}>
          D
        </span>
        <span className="absolute -right-0.5 -bottom-0.5 h-1.5 w-1.5 rounded-full bg-signal" />
      </div>
      <span className="font-display text-[22px] leading-none tracking-tight text-ink" style={{ fontWeight: 500 }}>
        Ditto
      </span>
    </div>
  );
}

function XIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2H21.5l-7.5 8.57L23 22h-6.844l-5.36-6.99L4.7 22H1.44l8.02-9.17L1 2h7.02l4.84 6.42L18.244 2Zm-2.4 18h1.9L7.24 4H5.22l10.624 16Z" />
    </svg>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 font-mono-ui text-[11px] uppercase tracking-[0.14em] text-signal">
      <span className="h-1 w-1 rounded-full bg-signal" />
      {children}
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-paper/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6">
        <Logo />
        <nav className="hidden items-center gap-9 text-[14px] text-graphite md:flex">
          <a href="#product" className="transition-colors hover:text-ink">Product</a>
          <a href="#how" className="transition-colors hover:text-ink">How it works</a>
          <a href="#pricing" className="transition-colors hover:text-ink">Pricing</a>
          <a href="#blog" className="transition-colors hover:text-ink">Blog</a>
        </nav>
        <div className="flex items-center gap-2">
          <button className="hidden px-3 py-2 text-[14px] text-graphite transition-colors hover:text-ink sm:inline-block">
            Log in
          </button>
          <button className="inline-flex items-center gap-2 rounded-[4px] bg-ink px-4 py-2.5 text-[14px] font-medium text-paper transition-colors hover:bg-signal">
            <XIcon className="h-3.5 w-3.5" />
            Connect X
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>
    </header>
  );
}

const marqueeQuotes = [
  { text: "Finally an AI that doesn't rewrite me into a LinkedIn bro.", handle: "@marcusgrowth" },
  { text: "Reads my last 800 tweets, writes the 801st. Weirdly personal.", handle: "@zoedesigns" },
  { text: "I edited nothing. That's never happened before.", handle: "@alexbuilds" },
  { text: "Not a 'writing tool.' A voice memory.", handle: "@priyacreates" },
  { text: "It knows I never use exclamation marks. Bless.", handle: "@samonx" },
  { text: "Zero em-dashes. Zero 'let's dive in.' Just me.", handle: "@devmarketer" },
];

function SocialMarquee() {
  const items = [...marqueeQuotes, ...marqueeQuotes];
  return (
    <section className="border-y border-hairline bg-paper-raised py-8 overflow-hidden">
      <div className="mx-auto mb-6 max-w-[1280px] px-6">
        <p className="font-mono-ui text-[11px] uppercase tracking-[0.14em] text-graphite">
          What people say after their first week
        </p>
      </div>
      <div className="relative">
        <div className="marquee-track flex w-max gap-4">
          {items.map((q, i) => (
            <figure
              key={i}
              className="w-[360px] shrink-0 rounded-md border border-hairline bg-paper px-5 py-4"
            >
              <blockquote className="text-[15px] leading-snug text-ink">"{q.text}"</blockquote>
              <figcaption className="mt-3 font-mono-ui text-[12px] text-graphite">{q.handle}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Hero() {
  return (
    <section className="relative mx-auto max-w-[1280px] px-6 pt-20 pb-24">
      <div className="mx-auto max-w-[880px]">
        <div className="fade-up">
          <Eyebrow>Voice DNA</Eyebrow>
        </div>
        <h1
          className="fade-up font-display mt-6 text-[54px] leading-[1.02] tracking-[-0.02em] text-ink md:text-[72px]"
          style={{ fontWeight: 500, animationDelay: "40ms" }}
        >
          Write like you.
          <br />
          <span className="text-graphite">Even when the AI is writing it.</span>
        </h1>
        <p
          className="fade-up mt-7 max-w-[620px] text-[18px] leading-[1.55] text-graphite"
          style={{ animationDelay: "80ms" }}
        >
          Ditto reads your writing once, learns the shape of your voice, and keeps sharpening
          every time you edit. It drafts posts that already sound like you — because they are.
        </p>

        <div
          className="fade-up mt-10 flex items-center gap-5"
          style={{ animationDelay: "120ms" }}
        >
          <SignatureLine width={420} height={72} />
        </div>

        <div
          className="fade-up mt-8 flex flex-wrap items-center gap-3"
          style={{ animationDelay: "160ms" }}
        >
          <button className="inline-flex items-center gap-2 rounded-[4px] bg-ink px-5 py-3 text-[14px] font-medium text-paper transition-colors hover:bg-signal">
            <XIcon className="h-3.5 w-3.5" />
            Connect X to build your Voice DNA
            <span aria-hidden>→</span>
          </button>
          <button className="inline-flex items-center rounded-[4px] px-4 py-3 text-[14px] font-medium text-graphite transition-colors hover:text-ink">
            See how it works
          </button>
        </div>

        <div
          className="fade-up mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-hairline pt-6 font-mono-ui text-[13px] text-graphite"
          style={{ animationDelay: "200ms" }}
        >
          <span><span className="text-ink">45K+</span> writers</span>
          <span className="text-graphite-faint">·</span>
          <span><span className="text-ink">2.4M+</span> posts drafted</span>
          <span className="text-graphite-faint">·</span>
          <span><span className="text-ink">96%</span> edit-free acceptance</span>
        </div>
      </div>
    </section>
  );
}

/* ---------- Section: It doesn't start from zero ---------- */

function ModeScreenshot({ kind }: { kind: "own" | "trending" | "inspiration" }) {
  return (
    <div className="mt-5 rounded-md border border-hairline bg-paper">
      <div className="flex items-center gap-1.5 border-b border-hairline px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-hairline-strong" />
        <span className="h-2 w-2 rounded-full bg-hairline-strong" />
        <span className="h-2 w-2 rounded-full bg-hairline-strong" />
      </div>
      <div className="space-y-3 p-4">
        {kind === "own" && (
          <>
            <div className="rounded border border-hairline bg-paper-raised p-3">
              <p className="text-[13px] text-graphite">What do you want to say?</p>
              <p className="mt-1 text-[13px] text-ink">
                shipping onboarding rewrite today — cut 3 screens, kept the good one.
              </p>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono-ui text-[11px] uppercase tracking-wider text-graphite">
                Voice DNA v7 · 78%
              </span>
              <span className="rounded-[4px] bg-ink px-2.5 py-1 text-[11px] font-medium text-paper">Generate →</span>
            </div>
          </>
        )}
        {kind === "trending" && (
          <>
            {["The founder-mode debate is back.", "AI eval leaderboards, again.", "Product-led growth is dead?"].map(
              (t, i) => (
                <div key={i} className="flex items-start justify-between gap-3 rounded border border-hairline bg-paper-raised p-3">
                  <div>
                    <p className="text-[13px] text-ink">{t}</p>
                    <p className="mt-1 font-mono-ui text-[11px] text-graphite">why: matches your builder-voice</p>
                  </div>
                  <span className="mt-0.5 shrink-0 rounded-full bg-confirm-tint px-2 py-0.5 font-mono-ui text-[10px] uppercase tracking-wider text-confirm">
                    substantive
                  </span>
                </div>
              ),
            )}
          </>
        )}
        {kind === "inspiration" && (
          <>
            <div className="grid grid-cols-3 gap-2">
              {["@paulg", "@patio11", "@shl", "@nikitabier", "@levie", "@sama"].map((h, i) => (
                <div
                  key={h}
                  className={`flex items-center gap-2 rounded border p-2 ${
                    i < 2 ? "border-ink bg-signal-tint" : "border-hairline bg-paper-raised"
                  }`}
                >
                  <span className="h-5 w-5 rounded-full bg-hairline-strong" />
                  <span className="font-mono-ui text-[11px] text-ink">{h}</span>
                </div>
              ))}
            </div>
            <p className="font-mono-ui text-[11px] text-graphite">
              We study structure, never sentences.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function StartSection() {
  const modes = [
    {
      key: "own" as const,
      title: "Own Idea",
      body: "You start with a thought. Ditto shapes it into your voice, not a template.",
    },
    {
      key: "trending" as const,
      title: "Trending",
      body: "Only substantive trends that actually fit your lane — scored, not scraped.",
    },
    {
      key: "inspiration" as const,
      title: "Inspiration",
      body: "Borrow the shape of a great post from writers you admire. Never their words.",
    },
  ];
  return (
    <section id="how" className="border-t border-hairline bg-paper py-24">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="max-w-[720px]">
          <Eyebrow>Three ways in</Eyebrow>
          <h2 className="font-display mt-4 text-[40px] leading-[1.05] tracking-[-0.02em] text-ink" style={{ fontWeight: 500 }}>
            It doesn't start from zero.
          </h2>
          <p className="mt-4 text-[16px] text-graphite">
            The blank page is the problem. Ditto gives you three honest starting points, each already
            filtered through your Voice DNA.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {modes.map((m) => (
            <article key={m.key} className="rounded-md border border-hairline bg-paper-raised p-6">
              <h3 className="font-display text-[24px] tracking-[-0.01em] text-ink" style={{ fontWeight: 500 }}>
                {m.title}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-graphite">{m.body}</p>
              <ModeScreenshot kind={m.key} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Section: Every edit teaches it something ---------- */

function DiffCard() {
  return (
    <div className="rounded-md border border-hairline bg-paper-raised p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono-ui text-[11px] uppercase tracking-wider text-graphite">Draft v1</span>
        <span className="font-mono-ui text-[11px] text-graphite-faint">generated · 0.8s</span>
      </div>
      <p className="text-[15px] leading-relaxed text-ink">
        <span className="rounded bg-signal-tint px-1 text-graphite line-through decoration-signal/40">
          Excited to announce
        </span>{" "}
        we shipped the onboarding rewrite today.{" "}
        <span className="rounded bg-signal-tint px-1 text-graphite line-through decoration-signal/40">
          Can't wait to see what you all think!
        </span>
      </p>
      <div className="my-4 h-px w-full bg-hairline" />
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono-ui text-[11px] uppercase tracking-wider text-signal">You edited</span>
        <span className="font-mono-ui text-[11px] text-graphite-faint">learned · +1 signal</span>
      </div>
      <p className="text-[15px] leading-relaxed text-ink">
        shipped the onboarding rewrite today —{" "}
        <span className="rounded bg-confirm-tint px-1 text-confirm">cut 3 screens, kept the good one.</span>
      </p>
      <div className="mt-5 flex flex-wrap gap-1.5">
        {["no announce-voice", "em-dash break", "lowercase start"].map((t) => (
          <span
            key={t}
            className="rounded-full border border-hairline bg-paper px-2 py-0.5 font-mono-ui text-[10px] uppercase tracking-wider text-graphite"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function EditsSection() {
  return (
    <section className="border-t border-hairline bg-paper-raised py-24">
      <div className="mx-auto grid max-w-[1280px] gap-14 px-6 md:grid-cols-2 md:items-center">
        <DiffCard />
        <div>
          <Eyebrow>Feedback loop</Eyebrow>
          <h2 className="font-display mt-4 text-[40px] leading-[1.05] tracking-[-0.02em] text-ink" style={{ fontWeight: 500 }}>
            Every edit teaches it something.
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-graphite">
            No thumbs-up modals. No "was this helpful?" surveys. The moment you change a word, Ditto
            notices — and the next draft won't make the same mistake.
          </p>
          <ul className="mt-6 space-y-3 text-[15px] text-ink">
            {[
              "Silent diff capture on every edit, regenerate, or discard.",
              "Explicit corrections in Voice DNA write straight to memory.",
              "Confidence climbs measurably — you can watch it move.",
            ].map((l) => (
              <li key={l} className="flex gap-3">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-signal" />
                <span>{l}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------- Section: Dashboard preview ---------- */

function ConfidenceRing({ pct = 78 }: { pct?: number }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const off = c * (1 - pct / 100);
  return (
    <div className="relative h-[120px] w-[120px]">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r={r} stroke="var(--hairline)" strokeWidth="6" fill="none" />
        <circle
          cx="50"
          cy="50"
          r={r}
          stroke="var(--signal)"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={off}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono-ui text-[22px] text-ink">{pct}%</span>
        <span className="font-mono-ui text-[10px] uppercase tracking-wider text-graphite">DNA</span>
      </div>
    </div>
  );
}

function MiniSparkline({ values }: { values: number[] }) {
  const w = 160;
  const h = 40;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / (max - min || 1)) * h;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-10 w-full">
      <polyline points={pts} fill="none" stroke="var(--ink)" strokeWidth="1.25" />
      <polyline points={`${pts} ${w},${h} 0,${h}`} fill="var(--signal-tint)" stroke="none" />
    </svg>
  );
}

function DashboardSection() {
  const stats = [
    { label: "Posts generated", value: "1,284", spark: [3, 5, 4, 7, 8, 6, 9, 11, 10, 13] },
    { label: "Avg time to post", value: "3m 42s", spark: [12, 10, 11, 9, 8, 8, 7, 6, 5, 4] },
    { label: "Acceptance rate", value: "96%", spark: [70, 74, 78, 82, 85, 88, 90, 92, 94, 96] },
  ];
  return (
    <section id="product" className="border-t border-hairline bg-paper py-24">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="mx-auto max-w-[720px] text-center">
          <Eyebrow>Voice DNA · v7</Eyebrow>
          <h2 className="font-display mt-4 text-[40px] leading-[1.05] tracking-[-0.02em] text-ink" style={{ fontWeight: 500 }}>
            A living portrait of how you write.
          </h2>
          <p className="mt-4 text-[16px] text-graphite">
            The DNA is the product. Not a black box — a page you can read, correct, and trust.
          </p>
        </div>

        <div className="mt-14 overflow-hidden rounded-md border border-hairline bg-paper-raised">
          <div className="flex items-center justify-between border-b border-hairline px-6 py-3">
            <span className="font-mono-ui text-[11px] uppercase tracking-[0.14em] text-graphite">
              ditto / dashboard
            </span>
            <span className="font-mono-ui text-[11px] text-graphite-faint">last sync · 2h ago</span>
          </div>

          <div className="grid gap-0 md:grid-cols-[280px_1fr]">
            {/* Sidebar */}
            <aside className="border-b border-hairline p-5 md:border-b-0 md:border-r">
              <nav className="space-y-1 text-[14px]">
                {["Home", "Generate", "Drafts", "Voice DNA", "Analytics", "Settings"].map((l, i) => (
                  <div
                    key={l}
                    className={`flex items-center justify-between rounded px-3 py-2 ${
                      i === 3 ? "bg-signal-tint text-signal" : "text-graphite hover:text-ink"
                    }`}
                  >
                    <span>{l}</span>
                    {i === 3 && <span className="font-mono-ui text-[10px]">v7</span>}
                  </div>
                ))}
              </nav>
              <div className="mt-8 rounded border border-hairline p-3">
                <div className="flex items-center gap-2">
                  <XIcon className="h-3.5 w-3.5 text-ink" />
                  <span className="font-mono-ui text-[12px] text-ink">@anurag</span>
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-confirm" />
                </div>
                <p className="mt-1 font-mono-ui text-[10px] text-graphite">connected · 847 tweets analyzed</p>
              </div>
            </aside>

            {/* Main */}
            <div className="p-6 md:p-8">
              <div className="flex flex-col items-start justify-between gap-5 border-b border-hairline pb-6 md:flex-row md:items-center">
                <div>
                  <h3 className="font-display text-[28px] tracking-[-0.01em] text-ink" style={{ fontWeight: 500 }}>
                    Good morning, Anurag.
                  </h3>
                  <p className="mt-1 text-[14px] text-graphite">
                    Voice DNA is up 4% this week. Two signature phrases added.
                  </p>
                </div>
                <ConfidenceRing pct={78} />
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {[
                  { title: "Tone", chips: ["direct", "dry-humor", "builder-voice"] },
                  { title: "Sentence length", chips: ["avg 14.2 words"] },
                  { title: "Signature phrases", chips: ["shipped", "no fluff", "under the hood"] },
                ].map((c) => (
                  <div key={c.title} className="rounded border border-hairline p-4">
                    <p className="font-mono-ui text-[10px] uppercase tracking-wider text-graphite">{c.title}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {c.chips.map((chip) => (
                        <span
                          key={chip}
                          className="rounded-full bg-signal-tint px-2 py-0.5 font-mono-ui text-[11px] text-signal"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {stats.map((s) => (
                  <div key={s.label} className="rounded border border-hairline p-4">
                    <p className="font-mono-ui text-[10px] uppercase tracking-wider text-graphite">{s.label}</p>
                    <p className="mt-1 font-mono-ui text-[22px] text-ink">{s.value}</p>
                    <div className="mt-2">
                      <MiniSparkline values={s.spark} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Testimonials ---------- */

function Stars() {
  return (
    <div className="flex items-center gap-0.5" aria-label="5 out of 5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 16 16" className="h-3.5 w-3.5 text-signal" fill="none">
          <path
            d="M2 12 L 5 4 L 9 11 L 14 3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </div>
  );
}

function Testimonials() {
  return (
    <section id="reviews" className="border-t border-hairline bg-paper py-24">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="mx-auto max-w-[720px] text-center">
          <Eyebrow>Reviews</Eyebrow>
          <h2 className="font-display mt-4 text-[44px] leading-[1.02] tracking-[-0.02em] text-ink" style={{ fontWeight: 500 }}>
            Writers stopped
            <br />
            sounding like everyone else.
          </h2>
        </div>

        {/* Hero quote — only dark surface in the whole app */}
        <div className="mt-12 grid gap-6 rounded-md bg-ink p-8 text-paper md:grid-cols-[1.4fr_1fr] md:p-10">
          <div>
            <Stars />
            <blockquote className="font-display mt-5 text-[26px] leading-[1.3] text-paper md:text-[30px]" style={{ fontWeight: 500 }}>
              "As a founder I have zero time for social. Ditto turns my rough voice notes into
              posts that sound exactly like me — down to the em-dash breaks. My account went from
              8K to 76K in six months and I spend fifteen minutes a day on content."
            </blockquote>
            <div className="mt-6 flex items-center gap-3">
              <span className="h-9 w-9 rounded-full bg-graphite" />
              <div>
                <p className="text-[14px] text-paper">Marcus Chen</p>
                <p className="font-mono-ui text-[12px] text-graphite-faint">@marcusgrowth · 76.1K followers</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 self-start">
            {[
              { v: "+850%", l: "follower growth in 6 months" },
              { v: "2.4K", l: "likes on this post" },
              { v: "15 min", l: "per day on content" },
              { v: "96%", l: "posts published unedited" },
            ].map((s) => (
              <div key={s.v} className="rounded border border-white/10 bg-white/[0.03] p-4">
                <p className="font-mono-ui text-[22px] text-paper">{s.v}</p>
                <p className="mt-1 text-[12px] leading-snug text-graphite-faint">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Grid of smaller quotes */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            {
              name: "Alex Rivera",
              handle: "@alexbuilds",
              followers: "42.8K",
              text: "I went from posting twice a week to daily. Ditto handles the hard part — coming up with good copy — and I just publish. My following 3x'd in 60 days.",
            },
            {
              name: "Zoe Martinez",
              handle: "@zoedesigns",
              followers: "31.2K",
              text: "The formatting alone is worth it. My posts look clean, professional, optimized for X — without me thinking about it. Invisible polish.",
            },
            {
              name: "Jamie Park",
              handle: "@jamiepark",
              followers: "55.4K",
              text: "Every thread I've written with Ditto has performed 4x better than what I used to write manually. It understands virality without cheapening it.",
            },
            {
              name: "Priya Rao",
              handle: "@priyacreates",
              followers: "18.5K",
              text: "Honestly thought AI writing tools were overhyped. Tried Ditto for a week. Engagement doubled. The hooks it writes are genuinely better than what I was doing.",
            },
            {
              name: "Samira Okafor",
              handle: "@samonx",
              followers: "9.7K",
              text: "Started at under 1K followers. 3 months with Ditto and almost at 10K. Consistent posting plus quality compounds fast. Do not sleep on this.",
            },
            {
              name: "Dev Sharma",
              handle: "@devmarketer",
              followers: "22.3K",
              text: "I was spending 2+ hours a day on content. Now it's 20 minutes. Ditto isn't just faster — it's genuinely better than what I was writing myself.",
            },
          ].map((r) => (
            <article key={r.handle} className="rounded-md border border-hairline bg-paper-raised p-5">
              <div className="flex items-center gap-3">
                <span className="h-9 w-9 rounded-full bg-hairline-strong" />
                <div>
                  <p className="text-[14px] text-ink">{r.name}</p>
                  <p className="font-mono-ui text-[11px] text-graphite">{r.handle}</p>
                </div>
                <XIcon className="ml-auto h-4 w-4 text-graphite-faint" />
              </div>
              <div className="mt-4">
                <Stars />
              </div>
              <p className="mt-3 text-[14px] leading-relaxed text-ink">"{r.text}"</p>
              <div className="mt-4 flex items-center justify-between font-mono-ui text-[11px] text-graphite">
                <span>{r.followers} followers</span>
                <span className="text-graphite-faint">♡ 1.2K · ↻ 348</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Pricing ---------- */

function Pricing() {
  const tiers = [
    {
      name: "Starter",
      price: "Free",
      note: "For trying out your Voice DNA",
      features: ["Voice DNA from your last 500 tweets", "20 drafts a month", "Own Idea mode"],
      cta: "Connect X",
      highlight: false,
    },
    {
      name: "Writer",
      price: "$18",
      per: "/mo",
      note: "For people posting daily",
      features: [
        "Unlimited Voice DNA sync",
        "Unlimited drafts",
        "All three modes",
        "Analytics + confidence tracking",
      ],
      cta: "Start writing",
      highlight: true,
    },
    {
      name: "Studio",
      price: "$54",
      per: "/mo",
      note: "For teams of 3 handles",
      features: ["Everything in Writer", "3 connected accounts", "Shared drafts library", "Priority sync"],
      cta: "Talk to us",
      highlight: false,
    },
  ];
  return (
    <section id="pricing" className="border-t border-hairline bg-paper-raised py-24">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="mx-auto max-w-[620px] text-center">
          <Eyebrow>Pricing</Eyebrow>
          <h2 className="font-display mt-4 text-[40px] leading-[1.05] tracking-[-0.02em] text-ink" style={{ fontWeight: 500 }}>
            Priced like a tool. Not a platform.
          </h2>
        </div>
        <div className="mx-auto mt-12 grid max-w-[1080px] gap-4 md:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`flex flex-col rounded-md border p-6 ${
                t.highlight ? "border-ink bg-paper" : "border-hairline bg-paper"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-[22px] text-ink" style={{ fontWeight: 500 }}>
                  {t.name}
                </h3>
                {t.highlight && (
                  <span className="rounded-full bg-signal-tint px-2 py-0.5 font-mono-ui text-[10px] uppercase tracking-wider text-signal">
                    most picked
                  </span>
                )}
              </div>
              <p className="mt-1 text-[13px] text-graphite">{t.note}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-display text-[40px] leading-none text-ink" style={{ fontWeight: 500 }}>
                  {t.price}
                </span>
                {t.per && <span className="font-mono-ui text-[13px] text-graphite">{t.per}</span>}
              </div>
              <ul className="mt-6 space-y-2.5 border-t border-hairline pt-5 text-[14px] text-ink">
                {t.features.map((f) => (
                  <li key={f} className="flex gap-2.5">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`mt-8 rounded-[4px] px-4 py-3 text-[14px] font-medium transition-colors ${
                  t.highlight
                    ? "bg-ink text-paper hover:bg-signal"
                    : "border border-ink text-ink hover:bg-paper-raised"
                }`}
              >
                {t.cta} →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */

function Footer() {
  return (
    <footer id="blog" className="border-t border-hairline bg-paper py-16">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-[280px] text-[14px] text-graphite">
              A writing memory. Not a writing generator.
            </p>
          </div>
          {[
            { title: "Product", items: ["Voice DNA", "Generate", "Drafts", "Analytics"] },
            { title: "Company", items: ["About", "Blog", "Careers", "Press"] },
            { title: "Legal", items: ["Privacy", "Terms", "Security", "Contact"] },
          ].map((c) => (
            <div key={c.title}>
              <p className="font-mono-ui text-[11px] uppercase tracking-[0.14em] text-graphite">{c.title}</p>
              <ul className="mt-4 space-y-2 text-[14px] text-ink">
                {c.items.map((i) => (
                  <li key={i}>
                    <a href="#" className="transition-colors hover:text-signal">
                      {i}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-hairline pt-6 md:flex-row md:items-center">
          <p className="font-mono-ui text-[12px] text-graphite">
            Built for people who already have a voice.
          </p>
          <div className="flex items-center gap-4 text-graphite">
            <a href="#" aria-label="X" className="transition-colors hover:text-ink">
              <XIcon className="h-4 w-4" />
            </a>
            <a href="#" className="font-mono-ui text-[12px] transition-colors hover:text-ink">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Nav />
      <main>
        <Hero />
        <SocialMarquee />
        <StartSection />
        <EditsSection />
        <DashboardSection />
        <Testimonials />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
