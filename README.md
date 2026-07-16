# Ditto — Write like you. Even when the AI is writing it.

Ditto learns your **Voice DNA** from your writing, then drafts X (Twitter) posts that sound exactly like you — because they are. Not a writing generator. A writing memory.

![Built with React](https://img.shields.io/badge/React-19-blue?logo=react)
![TanStack Start](https://img.shields.io/badge/TanStack_Start-1.x-orange)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)

---

## What is Ditto?

Most AI writing tools strip your personality and replace it with generic "LinkedIn-bro" copy. Ditto does the opposite — it studies **how** you write (tone, sentence length, punctuation quirks, signature phrases) and uses that fingerprint to draft posts that are indistinguishable from your own.

**Key numbers (demo data on the landing page):**

| Metric               | Value  |
| --------------------- | ------ |
| Writers using Ditto   | 45K+   |
| Posts drafted          | 2.4M+  |
| Edit-free acceptance   | 96%    |

---

## Why Ditto?

- **Voice DNA, not templates** — Ditto builds a living profile of your writing style. Not a static prompt. A model that gets smarter every time you edit a draft.
- **Three honest starting points** — Start from your own idea, ride a trending topic that fits your lane, or borrow the *structure* (never the words) of a post you admire.
- **Silent feedback loop** — No thumbs-up modals. No surveys. The moment you change a word, Ditto notices and the next draft won't make the same mistake.
- **Transparent confidence score** — Watch your Voice DNA confidence climb as Ditto learns. You can read, correct, and trust the profile it builds.
- **Built for speed** — Average time from blank page to published post: **3m 42s**.

---

## How It Works

```
1. Connect your X account
   └─ Ditto reads your last 500+ tweets to build your initial Voice DNA.

2. Choose a starting mode
   ├─ Own Idea     → You have a thought. Ditto shapes it into your voice.
   ├─ Trending     → Substantive trends scored for your lane, not scraped.
   └─ Inspiration  → Borrow structure from writers you admire. Never their words.

3. Generate & edit
   └─ Ditto drafts a post. You tweak it (or don't). Every edit teaches it something.

4. Publish
   └─ Voice DNA version increments. Confidence climbs. Repeat.
```

---

## Tech Stack

| Layer         | Technology                                                   |
| ------------- | ------------------------------------------------------------ |
| Framework     | [TanStack Start](https://tanstack.com/start) (React 19, SSR) |
| Routing       | [TanStack Router](https://tanstack.com/router) (file-based)  |
| Data fetching | [TanStack React Query](https://tanstack.com/query)           |
| Styling       | [Tailwind CSS 4](https://tailwindcss.com) + custom design tokens |
| UI primitives | [Radix UI](https://radix-ui.com) + [shadcn/ui](https://ui.shadcn.com) |
| Typography    | Fraunces (display), Inter (body), JetBrains Mono (UI mono)   |
| Build tool    | [Vite 8](https://vite.dev)                                   |
| Runtime       | [Bun](https://bun.sh)                                        |
| Language      | TypeScript 5                                                  |

---

## Project Structure

```
your-creative-spark/
├── public/               # Static assets (favicon, etc.)
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── SignatureLine.tsx   # Animated SVG signature/waveform
│   │   └── ui/                # shadcn/ui primitives
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities (error reporting, etc.)
│   ├── routes/
│   │   ├── __root.tsx    # Root layout (fonts, meta, error boundary)
│   │   └── index.tsx     # Landing page (all sections)
│   ├── router.tsx        # Router configuration
│   ├── server.ts         # SSR server entry
│   ├── start.ts          # TanStack Start entry
│   └── styles.css        # Design tokens & global styles
├── package.json
├── vite.config.ts
├── tsconfig.json
└── bunfig.toml
```

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (v1.3+)
- [Node.js](https://nodejs.org) (v18+ as a fallback)

### Install & Run

```bash
# Clone the repository
git clone https://github.com/anuraggdubey/your-creative-spark.git
cd your-creative-spark

# Install dependencies
bun install

# Start the dev server
bun run dev
```

The app will be available at **http://localhost:5173** (or the port Vite assigns).

### Build for Production

```bash
bun run build
bun run preview
```

---

## Design System

Ditto uses a custom **ink-and-paper** design language with semantic color tokens:

| Token            | Hex       | Usage                          |
| ---------------- | --------- | ------------------------------ |
| `--paper`        | `#FAFAF8` | Page background                |
| `--ink`          | `#14141A` | Primary text & UI              |
| `--graphite`     | `#5B5B63` | Secondary text                 |
| `--signal`       | `#E1402F` | Accent, CTAs, active states    |
| `--signal-tint`  | `#FDEDEA` | Light accent background        |
| `--confirm`      | `#2F6E51` | Success states                 |
| `--hairline`     | `#E4E3DE` | Borders & dividers             |

---

## Landing Page Sections

The single-page landing includes:

1. **Nav** — Sticky header with logo, navigation links, and "Connect X" CTA
2. **Hero** — Headline, subtext, animated signature SVG, stats bar
3. **Social Marquee** — Auto-scrolling testimonial ticker
4. **Three Ways In** — Own Idea / Trending / Inspiration mode cards with UI previews
5. **Feedback Loop** — Side-by-side diff showing how edits train Voice DNA
6. **Dashboard Preview** — Full mock of the Ditto dashboard (confidence ring, sparklines, voice chips)
7. **Testimonials** — Hero quote + 6-card grid with engagement stats
8. **Pricing** — Three tiers: Starter (Free), Writer ($18/mo), Studio ($54/mo)
9. **Footer** — Links, tagline, social

---

## Scripts

| Command          | Description                              |
| ---------------- | ---------------------------------------- |
| `bun run dev`    | Start Vite dev server with HMR           |
| `bun run build`  | Production build                         |
| `bun run preview`| Preview the production build locally     |
| `bun run lint`   | Run ESLint                               |
| `bun run format` | Format code with Prettier                |

---

## Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feat/your-feature`)
3. Commit your changes (`git commit -m "feat: add your feature"`)
4. Push to the branch (`git push origin feat/your-feature`)
5. Open a Pull Request

> **Note:** Avoid rewriting published git history (force push, rebase/amend pushed commits) as it may cause collaborators to lose project history.

---

## License

This project is private. All rights reserved.
