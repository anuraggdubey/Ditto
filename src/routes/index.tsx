import { createFileRoute, Link } from "@tanstack/react-router";
import { SignatureLine } from "@/components/SignatureLine";
import { useCallback, useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Moon, Sun, Search } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const revealEase = [0.16, 1, 0.3, 1] as const;
const revealViewport = { once: true, amount: 0.24 };

type RevealDirection = "up" | "left" | "right";

function revealOffset(direction: RevealDirection) {
  if (direction === "left") return { x: -34, y: 0 };
  if (direction === "right") return { x: 34, y: 0 };
  return { x: 0, y: 22 };
}

function ScrollReveal({
  children,
  delay = 0,
  className = "",
  direction = "up",
  scale = 1,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: RevealDirection;
  scale?: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  const offset = revealOffset(direction);

  return (
    <motion.div
      className={className}
      initial={prefersReducedMotion ? false : { opacity: 0, ...offset, scale }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={revealViewport}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.55,
        delay: prefersReducedMotion ? 0 : delay,
        ease: revealEase,
      }}
    >
      {children}
    </motion.div>
  );
}

function useDarkMode() {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return document.documentElement.classList.contains("dark");
  });

  const toggleDark = useCallback(() => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("ditto-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("ditto-theme", "light");
    }
  }, [dark]);

  return { dark, toggleDark };
}

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

function Nav({ dark, onToggleDark }: { dark: boolean; onToggleDark: () => void }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav className="fixed top-4 left-0 right-0 z-50 flex justify-center w-full px-4 transition-all duration-300">
      <div
        className="flex items-center justify-between transition-all duration-300 w-full max-w-[1000px] rounded-full h-[60px]"
        style={{
          background: dark ? "rgba(8, 5, 4, 0.7)" : "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid var(--line)",
          boxShadow: scrolled
            ? "0 8px 32px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0,0,0,0.08)"
            : "0 4px 12px rgba(0, 0, 0, 0.05)",
        }}
      >
        {/* Left: Logo */}
        <a href="#top" className="pl-4 pr-2 shrink-0">
          <Logo />
        </a>

        {/* Center: Links */}
        <div className="hidden md:flex items-center gap-1">
          {[
            { label: "Onboarding", to: "/onboarding" },
            { label: "Profile", to: "/profile" },
            { label: "Inspiration", to: "/inspiration" },
          ].map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="rounded-full px-3 py-1.5 text-[13px] font-medium transition-all duration-200"
              style={{ color: "var(--graphite)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--ink)";
                e.currentTarget.style.background = "rgba(128,128,128,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--graphite)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 pr-2 shrink-0">
          <button
            onClick={onToggleDark}
            className="grid h-[36px] w-[36px] place-items-center rounded-full transition-all duration-200"
            style={{
              background: "rgba(128,128,128,0.04)",
              border: "1px solid var(--line)",
              color: "var(--graphite)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--signal)";
              e.currentTarget.style.color = "var(--ink)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--line)";
              e.currentTarget.style.color = "var(--graphite)";
            }}
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun className="h-[14px] w-[14px]" /> : <Moon className="h-[14px] w-[14px]" />}
          </button>
          
          <Link
            to="/profile"
            className="hidden px-3 py-1.5 text-[13px] font-medium transition-colors hover:text-ink sm:inline-block"
            style={{ color: "var(--graphite)" }}
          >
            Profile
          </Link>
          
          <div className="relative group ml-1">
            <div className="absolute inset-0 rounded-full bg-[var(--signal)] opacity-40 blur-md transition-all duration-500 group-hover:opacity-70 group-hover:blur-lg"></div>
            <Link
              to="/onboarding"
              className="relative flex items-center justify-center gap-1.5 h-[36px] px-5 rounded-full font-bold text-[13px] transition-all"
              style={{
                background: "var(--signal)",
                color: "var(--paper)",
                boxShadow: "inset 0 1px 1px rgba(255,255,255,0.4)",
              }}
            >
              Start Onboarding
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

const marqueeQuotes = [
  { text: "Finally an AI that doesn't rewrite me into a LinkedIn bro.", handle: "@marcusgrowth" },
  { text: "I spent 10 minutes talking to it, and it writes exactly like me. Weirdly personal.", handle: "@zoedesigns" },
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
        <h1
          className="fade-up font-display mt-6 text-[54px] leading-[1.02] tracking-[-0.02em] text-ink md:text-[72px]"
          style={{ animationDelay: "40ms" }}
        >
          Your voice sets the tone.
          <br />
          <span className="text-graphite">Your bookmarks set the taste.</span>
        </h1>
        <p
          className="fade-up mt-7 max-w-[620px] text-[18px] leading-[1.55] text-graphite"
          style={{ animationDelay: "80ms" }}
        >
          Voice DNA is a conversational AI that learns how you think and write, then generates tweets in your authentic voice — inspired by creators you admire, refined by your feedback over time.
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
          <Link
            to="/onboarding"
            className="inline-flex items-center gap-2 rounded-[4px] bg-ink px-5 py-3 text-[14px] font-medium text-paper transition-colors hover:bg-signal"
          >
            Start Voice Onboarding
            <span aria-hidden>→</span>
          </Link>
          <a
            href="#how"
            className="inline-flex items-center rounded-[4px] px-4 py-3 text-[14px] font-medium text-graphite transition-colors hover:text-ink"
          >
            See how it works
          </a>
        </div>

        <div
          className="fade-up mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-hairline pt-6 font-mono-ui text-[13px] text-graphite"
          style={{ animationDelay: "200ms" }}
        >
          <span>Powered by <span className="text-ink">Pipecat Voice</span></span>
          <span className="text-graphite-faint">·</span>
          <span>Stored in <span className="text-ink">Supermemory</span></span>
          <span className="text-graphite-faint">·</span>
          <span><span className="text-ink">Continuous</span> feedback loop</span>
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
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      num: "01",
      title: "Conversational Profiling",
      description: "Talk to Voice DNA via Pipecat voice or text. It dynamically asks questions to extract your tone, audience, and beliefs.",
      visual: (
        <div className="dv-glass-panel p-6 w-full flex flex-col gap-4" style={{ borderRadius: "18px", boxShadow: "0 28px 80px rgba(0,0,0,0.44)" }}>
          <div className="flex justify-center mb-2">
            <div className="relative w-16 h-16 rounded-full flex items-center justify-center animate-pulse" style={{ background: "rgba(255,109,41,0.15)" }}>
              <div className="w-8 h-8 rounded-full bg-signal" />
            </div>
          </div>
          <div className="p-3 rounded-xl bg-paper border border-hairline max-w-[85%] self-start">
            <p className="text-[13px] text-ink">What's your stance on vibe-coded UIs?</p>
          </div>
          <div className="p-3 rounded-xl bg-signal text-paper max-w-[85%] self-end shadow-[0_4px_12px_rgba(255,109,41,0.3)]">
            <p className="text-[13px]">They're essential. I always push for distinctive design over generic templates.</p>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] font-mono-ui uppercase text-signal">Extracting trait:</span>
            <span className="px-2 py-0.5 rounded-full bg-signal-tint text-signal text-[10px] border border-signal/20 font-bold">Design Philosophy</span>
          </div>
        </div>
      )
    },
    {
      num: "02",
      title: "Inspiration Layer",
      description: "Connect X to sync your bookmarks and saved posts. We learn your structural taste and hooks, but never copy sentences.",
      visual: (
        <div className="dv-glass-panel p-6 w-full" style={{ borderRadius: "18px", boxShadow: "0 28px 80px rgba(0,0,0,0.44)" }}>
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-hairline">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-ink flex items-center justify-center">
                <XIcon className="h-4 w-4 text-paper" />
              </div>
              <span className="text-[14px] font-semibold text-ink">Bookmarks Synced</span>
            </div>
            <span className="text-[11px] font-mono-ui text-graphite">242 items</span>
          </div>
          <p className="text-[11px] font-mono-ui uppercase tracking-wider text-graphite mb-3">Admired Creators</p>
          <div className="flex flex-wrap gap-2">
            {["@paulg", "@patio11", "@shl", "@nikitabier", "@levie"].map((h) => (
              <span key={h} className="px-2.5 py-1 rounded-md border border-hairline bg-paper-raised text-[12px] text-ink font-mono-ui">{h}</span>
            ))}
          </div>
        </div>
      )
    },
    {
      num: "03",
      title: "Continuous Feedback",
      description: "Every time you edit a generated draft, the diff is sent back to Supermemory to continuously refine your Voice DNA.",
      visual: (
        <div className="dv-glass-panel p-6 w-full" style={{ borderRadius: "18px", boxShadow: "0 28px 80px rgba(0,0,0,0.44)" }}>
          <div className="mb-4">
             <p className="text-[13px] text-graphite line-through decoration-signal/60 mb-2">Excited to announce we shipped the onboarding rewrite today!</p>
             <p className="text-[14px] text-ink font-medium">shipped the onboarding rewrite today — cut 3 screens.</p>
          </div>
          <div className="p-3 rounded-lg bg-paper-raised border border-hairline">
             <div className="flex items-center gap-1.5 mb-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse shadow-[0_0_8px_var(--signal)]" />
               <p className="text-[10px] font-mono-ui text-signal uppercase tracking-wider font-bold">Learning Applied</p>
             </div>
             <p className="text-[12px] text-graphite">Avoid "Excited to announce". Prefer direct action statements with em-dashes.</p>
          </div>
        </div>
      )
    }
  ];

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let ctx = gsap.context(() => {
      const texts = gsap.utils.toArray<HTMLElement>('.hiw-text-step');
      const visuals = gsap.utils.toArray<HTMLElement>('.hiw-visual-step');
      if (texts.length === 0 || visuals.length === 0) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 10%", 
          end: "+=150%",
          pin: true,
          scrub: 0.5,
        }
      });

      tl.to(progressBarRef.current, {
        scaleX: 1,
        ease: "none",
        duration: steps.length - 1
      }, 0);

      gsap.set(texts.slice(1), { autoAlpha: 0, y: 30 });
      gsap.set(visuals.slice(1), { yPercent: 100 });

      const firstTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
          toggleActions: "play none none none"
        }
      });
      const firstNum = texts[0].querySelector('.hiw-num');
      const firstTitle = texts[0].querySelector('.hiw-title');
      const firstDesc = texts[0].querySelector('.hiw-desc');
      const firstGlow = texts[0].querySelector('.hiw-glow-line');
      
      firstTl.fromTo(firstNum, { filter: "blur(12px)", scale: 1.2, opacity: 0 }, { filter: "blur(0px)", scale: 1, opacity: 0.08, duration: 0.7, ease: "power2.out" }, 0)
             .fromTo(firstTitle, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0.2)
             .fromTo(firstDesc, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0.3)
             .fromTo(firstGlow, { scaleY: 0, opacity: 0 }, { scaleY: 1, opacity: 1, duration: 0.6, ease: "power2.out" }, 0.2)
             .fromTo(visuals[0], { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.4);

      steps.forEach((step, i) => {
        if (i === 0) return;
        const offset = i - 1;
        
        tl.to(texts[i - 1], { autoAlpha: 0, y: -30, duration: 0.4, ease: "power1.inOut" }, offset);
        tl.to(visuals[i], { yPercent: 0, ease: "power2.inOut", duration: 1 }, offset);
        
        const num = texts[i].querySelector('.hiw-num');
        const title = texts[i].querySelector('.hiw-title');
        const desc = texts[i].querySelector('.hiw-desc');
        const glow = texts[i].querySelector('.hiw-glow-line');
        
        const stepTl = gsap.timeline();
        stepTl.fromTo(num, { filter: "blur(12px)", scale: 1.2, opacity: 0 }, { filter: "blur(0px)", scale: 1, opacity: 0.08, duration: 0.5, ease: "power2.out" }, 0)
              .fromTo(title, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0.1)
              .fromTo(desc, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0.2)
              .fromTo(glow, { scaleY: 0, opacity: 0 }, { scaleY: 1, opacity: 1, duration: 0.5, ease: "power2.out" }, 0.1);
              
        tl.to(texts[i], { autoAlpha: 1, y: 0, duration: 0.4, ease: "power1.out" }, offset + 0.4);
        tl.add(stepTl, offset + 0.4);
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="how" className="py-24 relative z-10 w-full overflow-hidden">
      <ScrollReveal>
        <div className="mb-16 relative z-10 text-center flex flex-col items-center w-full px-6">
          <Eyebrow>Context Assembly</Eyebrow>
          <h2 className="text-5xl md:text-[5.5rem] font-black tracking-tighter leading-[0.95] mb-6 mt-4 text-transparent bg-clip-text animate-text-shimmer drop-shadow-sm font-display" style={{ letterSpacing: "-0.04em", backgroundImage: "linear-gradient(110deg, var(--ink) 45%, var(--ink) 50%, rgba(128,128,128,0.3) 55%, var(--ink) 60%)", backgroundSize: "200% auto" }}>
            It never starts from a blank slate.
          </h2>
          <p className="mt-4 text-[16px] text-graphite max-w-[720px]">
            Generic LLMs start cold. We retrieve your personal context via Supermemory Local on every generation call, assembling your exact tone, formatting habits, and signature phrases.
          </p>
        </div>
      </ScrollReveal>

      <div ref={containerRef} className="hiw-pinned mx-auto max-w-[1280px] rounded-3xl border border-hairline overflow-hidden relative" style={{ background: 'var(--paper-raised)', boxShadow: 'var(--shadow-soft)'}}>
        <div className="absolute top-0 left-0 w-full h-[3px] bg-hairline z-20">
          <div ref={progressBarRef} className="h-full bg-signal origin-left" style={{ transform: "scaleX(0)" }} />
        </div>

        <div className="grid md:grid-cols-2 h-[80vh] min-h-[500px]">
          {/* Left Column: Text Stack */}
          <div className="relative h-full flex flex-col justify-center px-6 md:px-12 border-r border-hairline">
            {steps.map((step) => (
              <div key={step.num} className="hiw-text-step absolute left-6 md:left-12 right-6 md:right-12">
                <div className="relative pl-8">
                  <div className="hiw-glow-line absolute left-0 top-0 bottom-0 w-[3px] bg-signal rounded-full origin-top" />
                  <span
                    className="hiw-num block text-7xl md:text-8xl font-bold font-sans"
                    style={{ color: "var(--ink)", opacity: 0, letterSpacing: "-0.04em", lineHeight: 1 }}
                  >
                    {step.num}
                  </span>
                  <h3 className="hiw-title mt-3 text-3xl font-display font-bold" style={{ color: "var(--ink)" }}>
                    {step.title}
                  </h3>
                  <p className="hiw-desc mt-3 text-[17px] leading-relaxed max-w-sm text-graphite font-sans">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Visual Stack */}
          <div className="relative h-full overflow-hidden" style={{ background: 'var(--paper)'}}>
            {steps.map((step) => (
              <div key={step.num} className="hiw-visual-step absolute inset-0 flex items-center justify-center p-8" style={{ background: 'var(--paper)' }}>
                <div className="perspective-1000 w-full max-w-lg">
                  {step.visual}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Section: Every edit teaches it something ---------- */

/* ---------- Section: Voice DNA (Replaces EditsSection) ---------- */

function VoiceDNACanvas() {
  const [activeNode, setActiveNode] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveNode((prev) => (prev + 1) % 3);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="rounded-3xl border border-hairline bg-[#080808] shadow-[0_12px_32px_rgba(0,0,0,0.2)] overflow-hidden relative w-full max-w-[400px] h-[320px] mx-auto dv-card">
      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          backgroundPosition: '-1px -1px'
        }}
      />
      
      {/* SVG Connecting Lines */}
      <svg viewBox="0 0 400 320" className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        <path 
          d="M 100,65 C 100,160 210,65 210,160" 
          fill="none" 
          stroke={activeNode === 0 ? "rgba(255, 109, 41, 0.8)" : "rgba(255, 109, 41, 0.3)"} 
          strokeWidth="1.5"
          strokeDasharray="4 4"
          className="transition-colors duration-500"
        />
        <path 
          d="M 210,160 C 210,255 300,160 300,255" 
          fill="none" 
          stroke={activeNode === 1 ? "rgba(255, 109, 41, 0.8)" : "rgba(255, 109, 41, 0.3)"} 
          strokeWidth="1.5"
          strokeDasharray="4 4"
          className="transition-colors duration-500"
        />
      </svg>

      {/* Node 1: Voice Intake */}
      <div 
        className={`absolute left-[20px] top-[30px] z-10 rounded-xl border border-white/10 bg-[#141414] p-4 w-[160px] shadow-lg transition-all duration-500 ${activeNode === 0 ? 'border-[var(--signal)] shadow-[0_0_20px_rgba(255,109,41,0.15)]' : ''}`}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-1.5 h-1.5 rounded-full ${activeNode === 0 ? 'bg-signal animate-pulse shadow-[0_0_8px_var(--signal)]' : 'bg-white/20'}`} />
          <span className="font-display text-[13px] font-bold text-white tracking-wide">Voice Intake</span>
        </div>
        <p className="text-[12px] text-white/50 leading-tight">Conversation captured</p>
      </div>

      {/* Node 2: Trait Extraction */}
      <div 
        className={`absolute left-[120px] top-[125px] z-10 rounded-xl border border-white/10 bg-[#141414] p-4 w-[180px] shadow-lg transition-all duration-500 ${activeNode === 1 ? 'border-[var(--signal)] shadow-[0_0_20px_rgba(255,109,41,0.15)]' : ''}`}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-1.5 h-1.5 rounded-full ${activeNode === 1 ? 'bg-signal animate-pulse shadow-[0_0_8px_var(--signal)]' : 'bg-white/20'}`} />
          <span className="font-display text-[13px] font-bold text-white tracking-wide">Trait Extraction</span>
        </div>
        <p className="text-[12px] text-white/50 leading-tight">Tone: Contrarian<br/>Design Philosophy</p>
      </div>

      {/* Node 3: Profile Sync */}
      <div 
        className={`absolute left-[220px] top-[220px] z-10 rounded-xl border border-white/10 bg-[#141414] p-4 w-[160px] shadow-lg transition-all duration-500 ${activeNode === 2 ? 'border-[var(--signal)] shadow-[0_0_20px_rgba(255,109,41,0.15)]' : ''}`}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-1.5 h-1.5 rounded-full ${activeNode === 2 ? 'bg-signal animate-pulse shadow-[0_0_8px_var(--signal)]' : 'bg-white/20'}`} />
          <span className="font-display text-[13px] font-bold text-white tracking-wide">Profile Sync</span>
        </div>
        <p className="text-[12px] text-white/50 leading-tight">Supermemory updated</p>
      </div>
    </div>
  );
}



function VoiceDNASection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const features = [
    { 
      id: 1, 
      title: "Pipecat Voice Intake", 
      text: "Low-latency, multilingual conversational pipeline. Talk naturally, and we extract your tone, audience, and beliefs in real-time.", 
      tags: ["Real-time", "Voice"] 
    },
    { 
      id: 2, 
      title: "Supermemory Local", 
      text: "Your Voice DNA isn't a black box. It's a persistent, readable JSON profile that lives locally and updates continuously.", 
      tags: ["Storage", "Local"] 
    },
    { 
      id: 3, 
      title: "The Inspiration Layer", 
      text: "Sync your bookmarks. We never copy content, we only study structure, pacing, and formatting to curate your unique taste.", 
      tags: ["Context", "Taste"] 
    },
    { 
      id: 4, 
      title: "Interactive Feedback Loop", 
      text: "Never start from a blank slate. Every time you edit a generated draft, those corrections are fed directly back into your Voice DNA.", 
      tags: ["Learning", "Feedback"] 
    },
  ];

  useEffect(() => {
    if (!containerRef.current || !trackRef.current) return;

    let ctx = gsap.context(() => {
      const track = trackRef.current;
      if (!track) return;
      
      const getScrollAmount = () => {
        const trackWidth = track.scrollWidth;
        const windowWidth = window.innerWidth;
        return Math.max(0, trackWidth - windowWidth);
      };

      const scrollAmount = getScrollAmount();
      
      if (scrollAmount > 0) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top", 
            end: () => `+=${scrollAmount}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          }
        });

        tl.to(track, {
          x: -scrollAmount,
          ease: "none"
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative z-10 w-full h-screen bg-paper overflow-hidden border-t border-hairline flex flex-col" id="voice-dna">
      
      {/* Horizontal Scrolling Track */}
      <div ref={trackRef} className="flex items-stretch h-full" style={{ width: 'max-content' }}>
        
        {/* Intro Panel (Scrolls away) */}
        <div className="w-[100vw] md:w-[45vw] shrink-0 h-full flex flex-col justify-center px-10 md:px-20 relative">
          {/* Glowing Core Container */}
          <div className="relative mb-8 flex items-center justify-center">
             {/* Segmented spinning rings with revolving planets */}
             <div className="absolute w-[150%] h-[150%] rounded-full border border-signal/50 opacity-80 animate-[spin_8s_linear_infinite]" style={{ borderTopColor: 'transparent', borderLeftColor: 'transparent' }}>
               <div className="absolute bottom-0 left-1/2 w-2 h-2 rounded-full bg-paper shadow-[0_0_12px_var(--paper)] -translate-x-1/2 translate-y-1/2" />
             </div>
             
             <div className="absolute w-[200%] h-[200%] rounded-full border border-signal/30 opacity-80 animate-[spin_12s_linear_infinite_reverse]" style={{ borderRightColor: 'transparent', borderBottomColor: 'transparent' }}>
               <div className="absolute top-0 left-1/2 w-1.5 h-1.5 rounded-full bg-signal-tint shadow-[0_0_8px_var(--signal)] -translate-x-1/2 -translate-y-1/2" />
             </div>
             
             <div className="absolute w-[250%] h-[250%] rounded-full border border-signal/15 opacity-80 animate-[spin_18s_linear_infinite]" style={{ borderLeftColor: 'transparent', borderBottomColor: 'transparent' }}>
               <div className="absolute top-1/2 right-0 w-2.5 h-2.5 rounded-full bg-signal shadow-[0_0_15px_var(--signal)] translate-x-1/2 -translate-y-1/2" />
             </div>
             
             {/* The Shiny Orb */}
             <div className="relative w-32 h-32 rounded-full overflow-hidden flex items-center justify-center animate-float shadow-[0_0_60px_var(--signal-tint)]" style={{ background: 'radial-gradient(circle at 30% 30%, var(--signal), #ff4d00)' }}>
               {/* Sweeping Shimmer Reflection */}
               <div className="absolute top-0 left-0 w-full h-full animate-text-shimmer mix-blend-overlay" style={{ backgroundImage: 'linear-gradient(110deg, transparent 20%, rgba(255,255,255,0.9) 45%, rgba(255,255,255,0.9) 55%, transparent 80%)', backgroundSize: '200% auto' }} />
               
               {/* Glassy 3D rim lighting */}
               <div className="absolute inset-0 rounded-full pointer-events-none" style={{ boxShadow: 'inset 0 4px 12px rgba(255,255,255,0.8), inset 0 -4px 12px rgba(0,0,0,0.4)' }} />
             </div>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight font-display text-ink text-center md:text-left">
            Your Voice DNA
          </h2>
          <p className="text-xl max-w-md leading-relaxed text-graphite text-center md:text-left mx-auto md:mx-0">
            Rules and heuristics extracted from your conversations and feedback, perfectly indexed and actively woven into your generations.
          </p>

          <div className="mt-12 w-full mx-auto md:mx-0 max-w-md">
            <VoiceDNACanvas />
          </div>
        </div>
        
        {/* Feature Typography Panels */}
        {features.map((feature, i) => (
          <div 
            key={feature.id} 
            className="w-[85vw] md:w-[60vw] shrink-0 h-full flex flex-col justify-center px-10 md:px-20 border-l border-hairline relative hover:bg-ink/[0.02] transition-colors duration-500"
          >
            {/* Subtle glow behind text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-signal/5 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 w-full max-w-3xl flex flex-col justify-center text-left">
              <span className="text-sm md:text-base font-bold tracking-widest uppercase text-signal mb-8 block font-mono-ui">
                {feature.tags[0]}
              </span>
              <h3 className="font-display font-black text-6xl md:text-7xl lg:text-[110px] leading-[0.85] tracking-tight uppercase text-ink mb-12 flex flex-col">
                {feature.title.split(' ').map((word, wordIndex) => (
                  <span key={wordIndex} className="block">{word}</span>
                ))}
              </h3>
              <p className="text-xl md:text-2xl leading-relaxed text-graphite max-w-md font-medium">
                {feature.text}
              </p>
            </div>
          </div>
        ))}
        
      </div>
    </div>
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

function PulseHotspot({ title, text, position, popDown = false }: { title: string, text: string, position: string, popDown?: boolean }) {
  return (
    <div className={`absolute z-50 group ${position}`}>
      <div className="relative w-6 h-6 flex items-center justify-center cursor-pointer">
        <div className="absolute inset-0 rounded-full bg-signal opacity-40 animate-ping" />
        <div className="relative w-2.5 h-2.5 rounded-full bg-signal shadow-[0_0_12px_var(--signal)]" />
      </div>

      <div className={`absolute left-1/2 -translate-x-1/2 ${popDown ? 'top-full mt-3' : 'bottom-full mb-3'} w-[260px] p-4 rounded-xl border border-hairline bg-paper/95 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.15)] opacity-0 ${popDown ? '-translate-y-2 group-hover:translate-y-0' : 'translate-y-2 group-hover:translate-y-0'} pointer-events-none group-hover:opacity-100 transition-all duration-300`}>
        <div className={`absolute ${popDown ? '-top-1.5 border-t border-l' : '-bottom-1.5 border-r border-b'} left-1/2 -translate-x-1/2 w-3 h-3 border-hairline bg-paper/95 rotate-45`} />
        <h4 className="font-mono-ui text-[10px] font-bold uppercase tracking-wider text-signal mb-1.5">{title}</h4>
        <p className="text-[13px] text-ink leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

function DashboardSection() {
  const stats = [
    { label: "Posts generated", value: "1,284", spark: [3, 5, 4, 7, 8, 6, 9, 11, 10, 13] },
    { label: "Avg time to post", value: "3m 42s", spark: [12, 10, 11, 9, 8, 8, 7, 6, 5, 4] },
    { label: "Acceptance rate", value: "96%", spark: [70, 74, 78, 82, 85, 88, 90, 92, 94, 96] },
  ];

  return (
    <section id="product" className="py-24 relative z-10 w-full overflow-hidden bg-paper-raised">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="grid lg:grid-cols-[300px_1fr] gap-12 lg:gap-16 items-center">
          
          <ScrollReveal>
            <div className="text-left mb-12 lg:mb-0">
              <Eyebrow>Voice DNA · v2</Eyebrow>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-[1.05] mb-6 mt-4 text-transparent bg-clip-text drop-shadow-sm font-display" style={{ letterSpacing: "-0.04em", backgroundImage: "linear-gradient(110deg, var(--ink) 45%, var(--ink) 50%, rgba(128,128,128,0.3) 55%, var(--ink) 60%)", backgroundSize: "200% auto" }}>
                How the AI learns your exact voice.
              </h2>
              <p className="mt-4 text-[16px] text-graphite leading-relaxed">
                Most AI tools write generic, soulless content. Ditto is different. We analyze your conversations to build a structured, transparent profile of your unique tone, audience, and topics.
                <br/><br/>
                Every time you edit a draft, the AI learns and updates your Voice DNA in real-time. Hover over the hotspots to see it in action.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="w-full relative">
              <div className="relative rounded-xl border border-hairline bg-paper shadow-[0_28px_80px_rgba(0,0,0,0.12)]">
              {/* Top Bar */}
              <div className="flex items-center justify-between border-b border-hairline px-6 py-3 bg-paper-raised rounded-t-xl">
                <span className="font-mono-ui text-[11px] uppercase tracking-[0.14em] text-graphite">
                  ditto / dashboard
                </span>
                <span className="font-mono-ui text-[11px] text-graphite-faint">last sync · 2h ago</span>
              </div>
              
              <div className="grid gap-0 md:grid-cols-[240px_1fr]">
                {/* Sidebar */}
                <aside className="border-r border-hairline p-5 hidden md:flex flex-col justify-between bg-paper-raised rounded-bl-xl">
                  <nav className="space-y-1 text-[14px]">
                    {["Home", "Generate", "Drafts", "Voice DNA", "Analytics", "Settings"].map((l, i) => (
                      <div
                        key={l}
                        className={`flex items-center justify-between rounded px-3 py-2 cursor-pointer ${
                          i === 3 ? "bg-signal-tint text-signal" : "text-graphite hover:bg-hairline hover:text-ink transition-colors"
                        }`}
                      >
                        <span>{l}</span>
                        {i === 3 && <span className="font-mono-ui text-[10px]">v2</span>}
                      </div>
                    ))}
                  </nav>
                  <div className="mt-8 rounded border border-hairline p-3 bg-paper">
                    <div className="flex items-center gap-2">
                      <XIcon className="h-3.5 w-3.5 text-ink" />
                      <span className="font-mono-ui text-[12px] text-ink">@anon</span>
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-confirm shadow-[0_0_8px_var(--confirm)]" />
                    </div>
                    <p className="mt-1 font-mono-ui text-[10px] text-graphite">connected · 24m analyzed</p>
                  </div>
                </aside>

                {/* Main Content */}
                <div className="p-6 md:p-10 relative">
                  {/* Hotspots */}
                  <PulseHotspot 
                    title="Live Confidence Tracking" 
                    text="Watch your Voice DNA evolve in real-time. Every edit you make directly increases your profile's confidence score."
                    position="top-[70px] right-[30px] md:top-[90px] md:right-[60px]"
                    popDown={true}
                  />
                  <PulseHotspot 
                    title="Deep Trait Extraction" 
                    text="We don't just count words. Our conversational engine extracts your target audience, core topics, and exact tone."
                    position="top-[250px] left-[50%] -translate-x-1/2 md:translate-x-0 md:left-[150px]"
                  />
                  <PulseHotspot 
                    title="Performance Analytics" 
                    text="Track exactly how much time you save and how often you accept drafts without edits. The DNA is the product."
                    position="bottom-[60px] right-[100px] md:bottom-[80px] md:right-[150px]"
                  />

                  <div className="flex flex-col items-start justify-between gap-5 border-b border-hairline pb-8 lg:flex-row lg:items-center">
                    <div>
                      <h3 className="font-display text-[32px] tracking-[-0.01em] text-ink font-bold">
                        Good morning, Anon.
                      </h3>
                      <p className="mt-2 text-[15px] text-graphite">
                        Voice DNA confidence up 4% this week. 12 edits applied via feedback loop.
                      </p>
                    </div>
                    <div className="shrink-0"><ConfidenceRing pct={78} /></div>
                  </div>

                  <div className="mt-8 grid gap-4 lg:grid-cols-3">
                    {[
                      { title: "Tone", chips: ["direct", "execution-first", "contrarian"] },
                      { title: "Target Audience", chips: ["founders", "web3 builders", "tech-twitter"] },
                      { title: "Core Topics", chips: ["saas growth", "solana", "bootstrapping"] },
                    ].map((c) => (
                      <div key={c.title} className="rounded-lg border border-hairline p-5 bg-paper-raised">
                        <p className="font-mono-ui text-[11px] uppercase tracking-wider text-graphite">{c.title}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {c.chips.map((chip) => (
                            <span
                              key={chip}
                              className="rounded-full bg-signal-tint border border-signal/10 px-2.5 py-1 font-mono-ui text-[11px] text-signal font-medium"
                            >
                              {chip}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 grid gap-4 lg:grid-cols-3">
                    {stats.map((s) => (
                      <div key={s.label} className="rounded-lg border border-hairline p-5 bg-paper-raised">
                        <p className="font-mono-ui text-[11px] uppercase tracking-wider text-graphite">{s.label}</p>
                        <p className="mt-2 font-mono-ui text-[24px] text-ink">{s.value}</p>
                        <div className="mt-4">
                          <MiniSparkline values={s.spark} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- Testimonials ---------- */

function NRating() {
  return (
    <div className="flex items-center gap-1 font-mono-ui italic text-[14px] font-bold text-signal tracking-widest">
      N N N N N
    </div>
  );
}

function Testimonials() {
  return (
    <section id="reviews" className="bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="mx-auto max-w-[720px] text-center mb-16">
          <h2 className="font-display text-[44px] leading-[1.02] tracking-[-0.02em] text-ink md:text-[52px]">
            Writers stopped
            <br />
            sounding like everyone else.
          </h2>
        </div>

        {/* Hero quote */}
        <div className="mx-auto max-w-[1000px] grid gap-8 rounded-xl bg-ink p-8 md:grid-cols-[1.3fr_1fr] md:p-14 shadow-2xl">
          <div className="pr-4 md:border-r md:border-hairline">
            <NRating />
            <blockquote className="font-display mt-8 text-[28px] leading-[1.25] text-paper md:text-[34px]" style={{ fontWeight: 750, letterSpacing: "-0.02em" }}>
              "As a founder I have zero time for social. Ditto turns my rough voice notes into
              posts that sound exactly like me — down to the em-dash breaks. My account went from
              8K to 76K in six months and I spend fifteen minutes a day on content."
            </blockquote>
            <div className="mt-10 flex items-center gap-3">
              <span className="h-10 w-10 rounded-full bg-graphite/40" />
              <div>
                <p className="text-[14px] text-paper font-medium">Marcus Chen</p>
                <p className="font-mono-ui text-[11px] text-graphite mt-0.5">@marcusgrowth · 76.1K followers</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-y-10 gap-x-6 md:pl-10 self-center">
            {[
              { v: "+850%", l: "follower growth in 6 months" },
              { v: "2.4K", l: "likes on this post" },
              { v: "15 min", l: "per day on content" },
              { v: "96%", l: "posts published unedited" },
            ].map((s) => (
              <div key={s.v}>
                <p className="font-mono-ui text-[24px] md:text-[28px] text-paper">{s.v}</p>
                <p className="mt-2 text-[12px] md:text-[13px] leading-snug text-graphite">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQs ---------- */

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "How is this different from ChatGPT?",
      a: "Ditto doesn't use generic prompt templates. It actively analyzes your past writing to build a persistent Voice DNA. When you generate a post, it draws directly from this profile, ensuring the output sounds exactly like you."
    },
    {
      q: "Can I manage multiple accounts?",
      a: "Yes. Our Studio plan allows you to connect and maintain separate Voice DNA profiles for multiple accounts, keeping their tones completely isolated."
    },
    {
      q: "Does editing drafts improve the AI?",
      a: "Absolutely. In fact, the feedback loop is the core of Ditto. Every time you tweak a generated draft, those edits are fed directly back into your Voice DNA to improve all future outputs."
    },
    {
      q: "Is my data secure and private?",
      a: "Yes. Your Voice DNA is stored locally or securely in your private cloud instance. We never use your personalized Voice DNA to train our foundational models."
    },
    {
      q: "What languages are supported?",
      a: "Currently, Ditto's Voice DNA extraction and generation are optimized for English, with experimental support for Spanish and French."
    },
    {
      q: "How much time does it actually save?",
      a: "On average, our users go from spending 45 minutes on a thread down to 10 minutes, because they no longer have to heavily edit AI outputs to sound human."
    }
  ];

  return (
    <section className="bg-paper-raised py-24 md:py-32">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="mb-16 text-center flex flex-col items-center w-full">
          <h2 className="font-display text-[44px] leading-[1.02] tracking-[-0.02em] text-ink md:text-[52px] mb-4">
            Frequently asked
            <br />
            questions
          </h2>
          <p className="text-[16px] md:text-[18px] max-w-2xl mx-auto leading-relaxed text-graphite">
            Everything you need to know about Voice DNA and the Ditto platform.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((item, i) => (
            <div 
              key={i}
              className="group transition-colors rounded-[2rem] overflow-hidden cursor-pointer bg-paper border border-hairline relative"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              {/* Subtle Hover Glow */}
              <div className="absolute inset-0 bg-ink opacity-0 group-hover:opacity-[0.02] transition-opacity duration-300 pointer-events-none" />
              
              <div className="relative z-10 p-6 md:p-8 flex items-start gap-6">
                <div className="shrink-0 mt-1">
                  <svg 
                    className="h-6 w-6 transition-transform duration-300 text-signal"
                    style={{ transform: openIndex === i ? "rotate(45deg)" : "rotate(0deg)" }}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div className="w-full">
                  <span className="font-display text-[20px] block tracking-tight text-ink font-semibold">
                    {item.q}
                  </span>
                  <div
                    className="transition-all duration-300 ease-in-out overflow-hidden"
                    style={{
                      maxHeight: openIndex === i ? "300px" : "0px",
                      opacity: openIndex === i ? 1 : 0,
                      marginTop: openIndex === i ? "1rem" : "0px"
                    }}
                  >
                    <p className="leading-relaxed text-[15px] text-graphite pr-4">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
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
    <footer className="relative z-10 w-full overflow-hidden mt-0 pb-0 bg-paper">
      {/* Background Image with Theme Gradient Overlay */}
      <div 
        className="absolute inset-0 z-0 mix-blend-screen opacity-50"
        style={{ 
          backgroundImage: "url('/footer-bg.png')",
          backgroundSize: "cover", 
          backgroundPosition: "center top",
          filter: "saturate(0.2) contrast(1.2)"
        }}
      />
      
      {/* Gradients to blend the background seamlessly into the theme */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-paper via-transparent to-paper/90" />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-paper via-paper/80 to-transparent" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_bottom,rgba(255,109,41,0.06)_0%,transparent_70%)]" />

      <div className="relative z-10 mx-auto max-w-[1280px] px-6 pt-32 pb-16">
        
        {/* 4 Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-32">
          
          {/* Brand Column */}
          <div className="md:col-span-4 flex flex-col items-start">
            <div className="group flex items-center gap-3 mb-8 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
              <span className="text-[28px] font-display tracking-tight text-ink transition-colors font-bold">Ditto</span>
            </div>
            
            <h3 className="text-[2rem] font-bold tracking-tight text-ink mb-6 font-display leading-[1.1]">
              A writing memory.<br />Not a generator.
            </h3>
            
            <p className="text-base text-graphite mb-8 leading-relaxed max-w-sm">
              Ditto turns your past writing into a persistent Voice DNA, ensuring every draft you generate sounds exactly like you.
            </p>
            
            <button className="bg-ink text-paper hover:opacity-80 px-6 py-3 rounded-full font-medium transition-all group flex items-center gap-2 shadow-md">
              Start building your DNA
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 transition-transform group-hover:translate-x-1">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
            
            <div className="mt-16 text-sm text-graphite space-y-3 font-medium">
              <p>© 2026 Ditto - All rights reserved</p>
              <div className="flex items-center gap-2">
                Built for people who have a voice.
              </div>
            </div>
          </div>
          
          {/* Menu Column */}
          <div className="md:col-span-2 md:col-start-6">
            <h4 className="text-ink font-bold mb-6 text-lg tracking-tight">Product</h4>
            <ul className="space-y-4 text-graphite font-medium">
              <li><a href="#" className="hover:text-ink transition-colors">Voice DNA</a></li>
              <li><a href="#" className="hover:text-ink transition-colors">Generate</a></li>
              <li><a href="#" className="hover:text-ink transition-colors">Drafts</a></li>
              <li><a href="#" className="hover:text-ink transition-colors">Analytics</a></li>
              <li><a href="#" className="hover:text-ink transition-colors">Pricing</a></li>
            </ul>
          </div>
          
          {/* Navigation Column */}
          <div className="md:col-span-2">
            <h4 className="text-ink font-bold mb-6 text-lg tracking-tight">Company</h4>
            <ul className="space-y-4 text-graphite font-medium">
              <li><a href="#" className="hover:text-ink transition-colors">About</a></li>
              <li><a href="#" className="hover:text-ink transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-ink transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-ink transition-colors">Press</a></li>
              <li><a href="#" className="hover:text-ink transition-colors">Contact</a></li>
            </ul>
          </div>
          
          {/* Legal Column */}
          <div className="md:col-span-3">
            <h4 className="text-ink font-bold mb-6 text-lg tracking-tight">Legal</h4>
            <ul className="space-y-4 text-graphite font-medium">
              <li><a href="#" className="hover:text-ink transition-colors">Privacy policy</a></li>
              <li><a href="#" className="hover:text-ink transition-colors">Terms of service</a></li>
              <li><a href="#" className="hover:text-ink transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-ink transition-colors">Data Processing</a></li>
              <li><a href="#" className="hover:text-ink transition-colors">Subprocessors</a></li>
            </ul>
          </div>
          
        </div>
      </div>
    </footer>
  );
}

function Landing() {
  const { dark, toggleDark } = useDarkMode();
  return (
    <div className="min-h-screen text-ink" id="top">
      <div className="boxed-wrapper">
        <Nav dark={dark} onToggleDark={toggleDark} />
        <main>
          <Hero />
          <SocialMarquee />
          <StartSection />
          <ScrollReveal direction="up" delay={0}><VoiceDNASection /></ScrollReveal>
          <ScrollReveal direction="up" delay={0}><DashboardSection /></ScrollReveal>
          <ScrollReveal direction="up" delay={0}><Testimonials /></ScrollReveal>
          <ScrollReveal direction="up" delay={0}><FAQSection /></ScrollReveal>
        </main>
        <ScrollReveal direction="up" delay={0}><Footer /></ScrollReveal>
      </div>
    </div>
  );
}
