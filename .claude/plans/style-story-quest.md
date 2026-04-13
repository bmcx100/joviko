Story Quest — Style Implementation Guide

Complete design system for the Story Quest educational gaming platform. Two experiences — one brand — one codebase. Follow this document exactly.

---

## 1. Architecture Decision: Single App, Not Monorepo

Do NOT set up a monorepo with separate apps. Use a **single Next.js 15 app** with route groups. The parent marketing site, parent dashboard, and kids' game all live in one codebase with shared fonts, shared auth, and one deployment.

A monorepo adds Turborepo config, cross-package imports, duplicate Tailwind configs, and deployment coordination — all for a product that doesn't have users yet. Route groups give you clean separation with zero overhead.

```
story-quest/
├── app/
│   ├── (marketing)/              # Parent-facing: landing page, pricing, about
│   │   ├── page.tsx              # Homepage (hero, features, philosophy, CTA)
│   │   ├── pricing/page.tsx
│   │   └── layout.tsx            # Marketing shell: navbar + footer
│   │
│   ├── (dashboard)/              # Parent-facing: progress tracking
│   │   ├── page.tsx              # Overview (streak, time, topics)
│   │   ├── progress/page.tsx     # Per-topic Leitner breakdown
│   │   ├── history/page.tsx      # Session history table
│   │   ├── settings/page.tsx     # Family profile, notifications
│   │   └── layout.tsx            # Dashboard shell: sidebar + topbar
│   │
│   ├── (play)/                   # Kid-facing: the game
│   │   ├── page.tsx              # Trail/map view (topic progression)
│   │   ├── session/page.tsx      # Active game session (full-screen, no chrome)
│   │   ├── badges/page.tsx       # Achievement collection
│   │   ├── profile/page.tsx      # Kid profile, streak, stats
│   │   └── layout.tsx            # Game shell: status bar + bottom nav
│   │
│   ├── layout.tsx                # Root: fonts, providers, global styles
│   └── globals.css               # Tailwind directives + noise overlay + custom utilities
│
├── components/
│   ├── shared/                   # Both platforms: Logo, BrandMark, LoadingSpinner
│   ├── marketing/                # Parent site: Hero, FeatureCard, PhilosophyBand, PricingGrid
│   ├── dashboard/                # Parent dashboard: ProgressChart, SessionTable, LeitnerViz
│   └── play/                     # Kids' game: ChunkyButton, MascotBubble, ProgressRing,
│                                 #   StatusBar, FeedbackOverlay, TrailMap, CelebrationBurst
│
├── lib/
│   ├── tokens.ts                 # Brand colors, fonts, spacing — single source of truth
│   ├── api.ts                    # Client for the existing Flask backend
│   └── sounds.ts                 # Audio manager (use-sound wrapper)
│
├── public/
│   ├── sounds/                   # MP3 files: tap.mp3, correct.mp3, wrong.mp3, celebration.mp3
│   └── mascot/                   # Owlbert SVGs (or emoji placeholders for MVP)
│
├── tailwind.config.ts
└── next.config.ts
```

### Why This Works

- **(marketing)** pages use Server Components for SEO — static generation for the landing page, zero client JS until interactive sections.
- **(dashboard)** pages use shadcn/ui components themed with brand tokens. Server-rendered data tables, client-side charts.
- **(play)** pages are almost entirely Client Components. The game session is a full-screen SPA within the route group — no server rendering needed for quiz questions. The trail/map view can SSR the curriculum structure.
- Shared `layout.tsx` at root loads fonts once, wraps providers once. No duplication.
- One `tailwind.config.ts`. One deployment. One domain.

### Existing Backend Integration

The Flask API at `/home/data/Documents/Webapps/edtech-api/` stays. This Next.js app is frontend-only. All data operations go through the API:

```ts
// lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export const api = {
  startSession: (studentId: string, topicId: string) =>
    fetch(`${API_BASE}/api/sessions/start`, { method: 'POST', ... }),
  submitAnswer: (sessionId: string, questionId: string, answer: string) =>
    fetch(`${API_BASE}/api/sessions/${sessionId}/answer`, { method: 'POST', ... }),
  getProgress: (studentId: string) =>
    fetch(`${API_BASE}/api/progress/${studentId}`),
  getParentReport: (studentId: string) =>
    fetch(`${API_BASE}/api/reports/${studentId}/summary`),
}
```

In production, proxy `/api/*` through Next.js rewrites to the Flask backend. In development, CORS or a simple proxy.

---

## 2. Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | **Next.js 15** (App Router) | Single app, route groups for separation |
| Styling | **Tailwind CSS v4** | If shadcn/ui compatibility is rocky with v4, drop to v3.4. Check on first `npx shadcn@latest init`. |
| Parent UI | **shadcn/ui** | Dashboard forms, tables, dialogs, dropdowns. Theme override to brand tokens. Only used in `(marketing)` and `(dashboard)` — never in `(play)`. |
| Kids UI | **Custom components** | shadcn is built for SaaS dashboards. The kids' game needs chunky 3D buttons, mascot speech bubbles, gamification bars, progress rings. None of these exist in shadcn. Build them from scratch in `components/play/`. |
| Animation | **Framer Motion 11+** | Parents: subtle fade-up, stagger. Kids: spring physics, whileTap, confetti. |
| Confetti | **canvas-confetti** | 3KB, no React wrapper needed. Call imperatively on celebrations. |
| Audio | **use-sound** | Lightweight React hook wrapping Howler.js. Pre-load sounds on mount, fire on events. |
| Icons | **Lucide React** | System icons. Custom SVGs for Owlbert. Emoji placeholders acceptable for MVP mascot. |
| Fonts | **next/font/google** | Nunito, Lora, IBM Plex Mono. Loaded once in root layout. |

---

## 3. Brand Tokens

Single source of truth. Every color, font, and spacing value lives in `lib/tokens.ts` and feeds into `tailwind.config.ts`.

### 3.1 Color Palette

```ts
// lib/tokens.ts
export const brand = {
  indigo:          '#3D5A80',  // Primary — trust, knowledge, nav, headings
  indigoLight:     '#5A7BA8',  // Hover states, gradient endpoints
  indigoDark:      '#2E4563',  // Pressed states, 3D button shadows
  terracotta:      '#C4613A',  // Accent — every CTA, error states
  terracottaLight: '#D4784F',  // Hover
  terracottaDark:  '#9A4C2D',  // Pressed, 3D shadows
  marigold:        '#D4943D',  // Secondary accent — streaks, warmth, warnings
  parchment:       '#FBF7F0',  // Page background (web platform)
  parchmentWarm:   '#FDF8F2',  // Page background (kids' app — slightly warmer)
  parchmentDark:   '#EDE8DF',  // Mascot bubble bg, subtle section bg
  cream:           '#F5F0E6',  // Card/surface background
  creamDark:       '#DDD6CA',  // Card borders, disabled button shadow
  creamMuted:      '#C4B9A8',  // Disabled button shadow (darker)
  ink:             '#2D2A26',  // Primary text
  pencil:          '#9B9088',  // Secondary text, labels, placeholders
  success:         '#5A7353',  // Correct answers, achievements, "Continue" button
  successDark:     '#3F5239',  // Success 3D shadow
} as const
```

### 3.2 Typography

```ts
// Loaded in app/layout.tsx via next/font/google
import { Nunito, Lora, IBM_Plex_Mono } from 'next/font/google'

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  weight: ['400', '600', '700', '800'],
})
const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  weight: ['400', '600'],
  style: ['normal', 'italic'],
})
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-ibm-plex-mono',
  weight: ['400', '500', '600', '700'],
})
```

**Usage rules:**

| Context | Font | Weight | Notes |
|---------|------|--------|-------|
| Parent headings | Nunito | 700–800 | Tight tracking `-0.02em` |
| Parent hero drama line | Lora Italic | 400 | The one serif moment — makes the hero feel editorial |
| Parent body | Nunito | 400 | 16px base |
| Parent data/labels | IBM Plex Mono | 500–600 | System labels, stats, monospace accents |
| Kids ALL text | Nunito | 600 | 15px base. Heavier than parent. No serif anywhere. |
| Kids numbers/stats | IBM Plex Mono | 700 | XP, scores, streak counts, step numbers |

**Rule: Lora never appears in `(play)/`.** The serif drama font is a parent-facing design element. Kids get Nunito everywhere.

### 3.3 Noise Overlay

Adds warmth and kills the flat digital look. Apply to the web platform only. Skip on mobile — the SVG filter causes jank on low-end phones, and the kids' app has enough visual texture from the chunky buttons and colorful elements.

```css
/* globals.css — only loaded by (marketing) and (dashboard) layouts */
.noise-overlay::after {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
```

---

## 4. Tailwind Configuration

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          indigo:            '#3D5A80',
          'indigo-light':    '#5A7BA8',
          'indigo-dark':     '#2E4563',
          terracotta:        '#C4613A',
          'terracotta-light':'#D4784F',
          'terracotta-dark': '#9A4C2D',
          marigold:          '#D4943D',
          parchment:         '#FBF7F0',
          'parchment-warm':  '#FDF8F2',
          'parchment-dark':  '#EDE8DF',
          cream:             '#F5F0E6',
          'cream-dark':      '#DDD6CA',
          'cream-muted':     '#C4B9A8',
          ink:               '#2D2A26',
          pencil:            '#9B9088',
          success:           '#5A7353',
          'success-dark':    '#3F5239',
        },
      },
      fontFamily: {
        heading: ['var(--font-nunito)', 'system-ui', 'sans-serif'],
        drama:   ['var(--font-lora)', 'Georgia', 'serif'],
        mono:    ['var(--font-ibm-plex-mono)', 'monospace'],
        body:    ['var(--font-nunito)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'card':   '1.25rem',
        'button': '1.5rem',
        'chunky': '1rem',
        'badge':  '0.5rem',
      },
      boxShadow: {
        'card':       '0 2px 8px rgba(45,42,38,0.06)',
        'elevated':   '0 8px 24px rgba(45,42,38,0.10)',
        'chunky-3':   '0 3px 0 var(--tw-shadow-color)',
        'chunky-4':   '0 4px 0 var(--tw-shadow-color)',
        'chunky-0':   '0 0px 0 var(--tw-shadow-color)',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%':      { transform: 'translateX(-6px)' },
          '40%':      { transform: 'translateX(6px)' },
          '60%':      { transform: 'translateX(-4px)' },
          '80%':      { transform: 'translateX(4px)' },
        },
        'pulse-ring': {
          '0%':   { boxShadow: '0 0 0 0 rgba(61,90,128,0.3)' },
          '100%': { boxShadow: '0 0 0 12px rgba(61,90,128,0)' },
        },
      },
      animation: {
        shake:       'shake 0.4s ease-in-out',
        'pulse-ring':'pulse-ring 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
export default config
```

### shadcn/ui Theme Override

When initializing shadcn (`npx shadcn@latest init`), override the CSS variables in `globals.css`:

```css
@layer base {
  :root {
    --background:         43 55% 97%;    /* brand-parchment */
    --foreground:         20 7% 15%;     /* brand-ink */
    --card:              37 38% 93%;     /* brand-cream */
    --card-foreground:   20 7% 15%;      /* brand-ink */
    --primary:           210 35% 37%;    /* brand-indigo */
    --primary-foreground: 0 0% 100%;     /* white */
    --secondary:         37 38% 93%;     /* brand-cream */
    --secondary-foreground: 20 7% 15%;   /* brand-ink */
    --accent:            16 55% 50%;     /* brand-terracotta */
    --accent-foreground: 0 0% 100%;      /* white */
    --muted:             27 8% 57%;      /* brand-pencil */
    --muted-foreground:  27 8% 57%;      /* brand-pencil */
    --border:            35 19% 83%;     /* brand-cream-dark */
    --ring:              210 35% 37%;    /* brand-indigo */
    --radius:            1.25rem;
  }
}
```

**shadcn components to install**: Button, Card, Table, Dialog, Sheet, DropdownMenu, Input, Label, Tabs, Badge, Separator, ScrollArea. Only import these in `(marketing)` and `(dashboard)` components. Never in `(play)`.

---

## 5. Web Platform — Parent-Facing Design Spec

Everything under `(marketing)/` and `(dashboard)/`.

### 5.1 Global Rules

| Property | Value |
|----------|-------|
| Background | `bg-brand-parchment` on `<body>` |
| Noise overlay | Applied via `.noise-overlay` class on layout wrapper |
| Max content width | `max-w-[1200px] mx-auto` |
| Base font | Nunito 400, `text-brand-ink`, `text-base` (16px) |
| Link style | `text-brand-indigo hover:underline` |
| Focus ring | `ring-2 ring-brand-indigo ring-offset-2 ring-offset-brand-parchment` |
| Section spacing | `py-20 lg:py-28` between major sections |

### 5.2 Navbar

Sticky top, frosted glass.

```
bg-brand-parchment/80 backdrop-blur-xl border-b border-brand-cream-dark
h-16 px-6 max-w-[1200px] mx-auto
flex items-center justify-between
```

| Element | Spec |
|---------|------|
| Logo | 32px square, `bg-brand-indigo rounded-[10px]`, white 🦉 centered. Next to it: "Story Quest" in `font-heading font-extrabold text-brand-indigo text-[17px]`. Flex row, `gap-2`. |
| Nav links | `font-heading font-medium text-[13px] text-brand-pencil hover:text-brand-ink transition-colors`. Items: "How It Works", "For Parents", "Pricing". |
| CTA | `bg-brand-terracotta text-white font-heading font-bold text-xs px-5 py-2 rounded-button hover:bg-brand-terracotta-light transition-colors` |
| Mobile (< md) | Hide nav links and CTA. Show hamburger icon. On tap: shadcn Sheet from right with stacked links + CTA. |

### 5.3 Hero Section

Near full-viewport. Two-column on desktop, stacked on mobile.

**Left column** (`lg:w-[60%]`):

| Element | Desktop | Mobile |
|---------|---------|--------|
| System label | `font-mono font-semibold text-[11px] uppercase tracking-[0.1em] text-brand-indigo mb-3` | Same |
| Headline pt 1 | `font-heading font-extrabold text-[42px] leading-[1.08] text-brand-ink` | `text-[32px]` |
| Headline pt 2 | `font-drama italic text-[56px] leading-none text-brand-indigo` | `text-[44px]` |
| Body copy | `font-body text-brand-pencil text-base leading-relaxed max-w-[420px] mt-4` | `mt-3` |
| CTA button | `bg-brand-terracotta text-white font-heading font-bold text-[15px] px-7 py-4 rounded-button mt-6` | Full width |
| Sub-CTA text | `font-body text-brand-pencil text-xs mt-2` — "No credit card required" | Same |

**Right column** (`lg:w-[40%]`):
A miniature mockup of the kids' app inside a device frame. `bg-brand-parchment-warm rounded-[24px] p-4 shadow-elevated border border-brand-cream-dark`. This is NOT a screenshot — build it as a real React component showing Owlbert, a pattern question, answer buttons, and the Check button at reduced scale. It proves the product is real.

**Animation** (Framer Motion):
```tsx
// Each element staggers in
<motion.div
  initial={{ opacity: 0, y: 24 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
/>

// App mockup enters with scale
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
/>
```

### 5.4 Trust Bar

Horizontal row below hero. `py-6`, flex with `gap-8`, centered.

Each item: icon (20px, `text-brand-indigo`) + label (`font-heading font-semibold text-[13px] text-brand-pencil`).

| Icon | Label |
|------|-------|
| 🚫 | Zero ads, ever |
| 🔒 | COPPA compliant |
| 📊 | Parent dashboard |
| 🦉 | Guided by Owlbert |

Mobile: 2x2 grid instead of horizontal row.

### 5.5 Feature Cards

Three cards. Desktop: 3-column grid, `gap-4`. Mobile: stacked, full width.

```
bg-brand-cream rounded-card p-6 border border-brand-cream-dark shadow-card
```

Each card:
- Icon container: `w-10 h-10 rounded-badge flex items-center justify-center text-white text-lg mb-3`. Background alternates: `bg-brand-indigo`, `bg-brand-terracotta`, `bg-brand-indigo`.
- Title: `font-heading font-bold text-base text-brand-ink mb-1`
- Description: `font-body text-sm text-brand-pencil leading-relaxed`

Card content:
1. 📖 **Story Worlds** — "Kids explore narrative adventures where every choice teaches reading, logic, and critical thinking."
2. 🧩 **Craft Lab** — "Hands-on building challenges for math, patterns, and spatial reasoning — creation over consumption."
3. 📊 **Parent Dashboard** — "See what they're learning, how long they play, and where they're growing — real data, not vanity metrics."

**Animation**: `whileInView`, stagger 0.12s, fade up 20px.

### 5.6 Philosophy Section

Full-width dark band. Breaks out of max-width container.

```
bg-brand-ink py-20 lg:py-28 -mx-[calc((100vw-1200px)/2)] px-6
```

Text centered, `max-w-[720px] mx-auto`.

- Line 1: `font-heading text-brand-parchment/50 text-base` — "Most ed-tech games focus on: drill, repetition, and screen addiction."
- Line 2: `font-drama italic text-brand-parchment text-[36px] lg:text-[42px] leading-tight mt-4` — "We built for `<span className="text-brand-terracotta">imagination.</span>`"

**Animation**: Lines enter sequentially, 0.2s apart, fade up.

### 5.7 How It Works

Three numbered steps. Centered, `max-w-[720px]`.

Each step: flex row on desktop (number left, text right), stacked on mobile.

- Number: `font-mono font-bold text-[48px] text-brand-terracotta`
- Title: `font-heading font-bold text-xl text-brand-ink`
- Description: `font-body text-[15px] text-brand-pencil leading-relaxed`

Steps:
1. **Set up a family profile** — "Pick your kids' ages and subjects. Takes 2 minutes."
2. **Kids play daily quests** — "15 minutes a day. Owlbert guides them through stories, puzzles, and challenges."
3. **You see the results** — "Real progress data on your dashboard. What they learned, where they're growing."

### 5.8 Pricing

Three-tier grid using shadcn Card.

| Tier | Style |
|------|-------|
| Standard cards | `bg-brand-cream border-brand-cream-dark` |
| Highlighted (middle) | `bg-brand-indigo text-white ring-2 ring-brand-indigo scale-[1.03]` |
| Standard CTA | shadcn Button, `bg-brand-indigo text-white` |
| Highlighted CTA | shadcn Button, `bg-brand-terracotta text-white` |

### 5.9 Footer

```
bg-brand-ink rounded-t-[2rem] mt-16 py-12 px-8
```

Grid: brand column + 2 nav columns + legal row.

- Brand: 🦉 + "Story Quest" in `font-heading font-bold text-brand-parchment`
- Links: `font-body text-[13px] text-brand-parchment/60 hover:text-brand-parchment`
- Legal: `font-mono text-[11px] text-brand-parchment/40`

### 5.10 Parent Dashboard

Separate layout under `(dashboard)/`. Uses shadcn/ui components themed with brand tokens.

**Shell:**
- Desktop: left sidebar (240px, `bg-brand-cream border-r border-brand-cream-dark`) + main content area
- Mobile: bottom tab bar (4 tabs: Overview, Progress, History, Settings)

**Key views:**
- **Overview**: Summary cards (streak, time today, topics mastered) + recent session list
- **Progress**: Per-topic accordion with Leitner box visualization (5 boxes, item counts, color-coded)
- **History**: shadcn Table — date, topic, score, duration
- **Settings**: Family profile form, notification toggles

All data fetched from the Flask API via `lib/api.ts`.

---

## 6. Mobile Webapp — Kid-Facing Design Spec

Everything under `(play)/`. This is a mobile-first web app. The game session is a full-screen SPA — no server rendering, no page navigations during gameplay.

### 6.1 Global Rules

| Property | Value |
|----------|-------|
| Background | `bg-brand-parchment-warm` (`#FDF8F2`) — warmer than the parent site |
| Noise overlay | **None**. Skip on mobile — causes jank on low-end phones. The chunky buttons and colorful elements provide enough texture. |
| Scrolling during gameplay | **None**. Each question fills the viewport. Transitions between questions are animated, not scrolled. |
| Minimum tap target | 48x48px. Most interactive elements are 56–64px height. |
| Base font | `font-body font-semibold text-[15px] text-brand-ink`. Kids' app uses weight 600 everywhere — heavier than parent for readability on small screens. |
| Serif font | **Never used.** Lora does not appear anywhere in `(play)/`. Nunito for all text. IBM Plex Mono for numbers only. |
| Max game width | `max-w-[480px] mx-auto`. Even on desktop, the game stays phone-sized. Wrap in a centered container. |

### 6.2 Layout — Game Session

The active quiz session (`(play)/session/page.tsx`). Full viewport, no navigation chrome.

```
┌────────────────────────────────┐
│  ❤️ 4     🔥 12     ⭐ 340     │  Status Bar — 56px, fixed top, px-5
├────────────────────────────────┤
│  ████████████░░░░░░░░░░░░░░░  │  Progress Bar — h-2, mx-5, mt-2
├────────────────────────────────┤
│                                │
│  🦉  "Which number comes       │  Mascot + Question — flex, gap-3, px-5
│       next in the pattern?"    │
│                                │
│     [ 2 ] [ 4 ] [ 6 ] [ ? ]   │  Visual Area — centered, varies by question type
│                                │
│  ┌──────────────────────────┐  │
│  │  (A)  7                  │  │  Answer buttons — stacked, mx-5, gap-3
│  └──────────────────────────┘  │
│  ┌──────────────────────────┐  │
│  │  (B)  8                  │  │  ← selected state (indigo bg)
│  └──────────────────────────┘  │
│  ┌──────────────────────────┐  │
│  │  (C)  10                 │  │
│  └──────────────────────────┘  │
│                                │
│  ┌══════════════════════════┐  │  Check button — mx-5, mb-safe
│  ║       C H E C K          ║  │  Terracotta bg, chunky 4px shadow
│  └══════════════════════════┘  │
└────────────────────────────────┘
```

### 6.3 Status Bar

`h-14 px-5 flex items-center justify-between`. Fixed top. Background: transparent.

Three stat pills, each: `flex items-center gap-1 font-bold text-[13px]`

| Stat | Color | Icon |
|------|-------|------|
| Hearts | `text-brand-terracotta` | ❤️ |
| Streak | `text-brand-marigold` | 🔥 |
| XP/Stars | `text-brand-indigo` | ⭐ |

Hearts deplete on wrong answers. When hearts reach 0, session ends with a "Try again tomorrow" screen (or hearts refill on a timer — decide during implementation).

### 6.4 Progress Bar

Below status bar. `mx-5 mt-2`.

```
Track:  h-2 rounded-full bg-brand-parchment-dark
Fill:   h-2 rounded-full bg-gradient-to-r from-brand-indigo to-brand-indigo-light
```

10 questions per session = 10% per step. Animate width with Framer Motion: `transition={{ duration: 0.4, ease: "easeOut" }}`.

### 6.5 Mascot ("Owlbert")

Speech bubble layout before each question.

```tsx
<div className="flex gap-3 items-start px-5 mb-4">
  <div className="w-11 h-11 rounded-full bg-brand-indigo flex items-center justify-center text-white text-xl shrink-0">
    🦉  {/* Replace with SVG when assets are ready */}
  </div>
  <div className="bg-brand-parchment-dark rounded-2xl rounded-tl-sm px-4 py-3 text-sm font-semibold text-brand-ink leading-snug">
    Which number comes next in the pattern?
  </div>
</div>
```

**Mascot states** (swap SVG or emoji):

| State | When | Visual |
|-------|------|--------|
| Neutral | Presenting a question | Calm owl |
| Encouraging | After close-but-wrong | Head tilt |
| Celebrating | After correct | Wings up |
| Thinking | Hard question | Hand on chin |
| Streak fire | 3+ correct in a row | Sparkle/fire effect |
| Teaching | Reviewing mistakes | Pointing |

**Animation**: Spring entrance from left.
```tsx
<motion.div
  initial={{ opacity: 0, x: -12 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ type: "spring", stiffness: 300, damping: 24 }}
/>
```

### 6.6 Answer Buttons — The Core Component

This is the most important component in the entire app. Get this right first.

**Component: `ChunkyButton`**

Props: `label`, `letter` (A/B/C/D), `state` (default | selected | correct | incorrect | disabled), `onPress`.

**Default state:**
```tsx
className={cn(
  "w-full px-4 py-3.5 rounded-chunky border-[2.5px] flex items-center gap-3",
  "font-body font-semibold text-[15px] cursor-pointer select-none",
  "transition-transform duration-100",
  // Default
  "bg-brand-parchment-warm border-brand-cream-dark text-brand-ink",
  "shadow-[0_3px_0_theme(colors.brand.cream-dark)]",
  // Active press
  "active:translate-y-[3px] active:shadow-[0_0px_0_theme(colors.brand.cream-dark)]",
)}
```

**Letter badge** (inside button):
```tsx
<span className="w-7 h-7 rounded-full bg-brand-parchment-dark text-brand-ink text-xs font-bold flex items-center justify-center shrink-0">
  {letter}
</span>
```

**State styles:**

| State | Background | Border | Shadow color | Text | Badge |
|-------|-----------|--------|-------------|------|-------|
| default | `parchment-warm` | `cream-dark` | `cream-dark` | `ink` | `parchment-dark` bg, `ink` text |
| selected | `indigo` | `indigo-dark` | `indigo-dark` | `white` | `white/20` bg, `white` text |
| correct | `success` | `success-dark` | `success-dark` | `white` | `white/20` bg, `white` text |
| incorrect | `terracotta` | `terracotta-dark` | `terracotta-dark` | `white` | `white/20` bg, `white` text |
| disabled | `cream-dark` | `cream-muted` | `cream-muted` | `pencil` | `cream-muted` bg, `pencil` text |

**Incorrect animation**: Apply `animate-shake` class for 0.4s, then remove.

**Framer Motion version** (recommended over CSS active states for better spring feel):
```tsx
<motion.button
  whileTap={{ y: 3 }}
  transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.5 }}
>
```

### 6.7 Check / Continue Button

Full-width. Fixed to bottom of game area. `mx-5 mb-[env(safe-area-inset-bottom,16px)]`.

Same chunky 3D press behavior as answer buttons but with `shadow-chunky-4` (4px instead of 3px — slightly chunkier).

| State | Background | Shadow | Text |
|-------|-----------|--------|------|
| Disabled (no selection) | `cream-dark` | `cream-muted` | `pencil` |
| Enabled (answer selected) | `terracotta` | `terracotta-dark` | `white` |
| After correct (becomes "Continue") | `success` | `success-dark` | `white` |
| After incorrect (becomes "Continue") | `terracotta` | `terracotta-dark` | `white` |

Text: `font-heading font-bold text-base uppercase tracking-wide`.

Press: `active:translate-y-1 active:shadow-chunky-0`.

### 6.8 Question Visuals

The area between the mascot bubble and the answer buttons. Content varies by question template (see `grade1-learning-system.md` for all 50+ templates).

**Number blocks** (patterns, counting):
- `flex gap-2 justify-center my-4`
- Each block: `w-11 h-11 rounded-[10px] bg-brand-indigo text-white font-extrabold text-lg flex items-center justify-center`
- Missing block: `w-11 h-11 rounded-[10px] bg-brand-parchment-dark border-2 border-dashed border-brand-cream-dark text-brand-pencil`

**Object displays** (counting, sorting, grouping):
- Container: `bg-brand-parchment-dark rounded-card p-4 mx-5`
- Objects: emoji at 32–40px, arranged in grid or scattered

**Number line**:
- Track: `h-0.5 bg-brand-ink/20 mx-5 relative`
- Labels: `font-mono text-xs text-brand-pencil`
- Target marker: `w-6 h-6 rounded-full bg-brand-terracotta animate-pulse-ring absolute`

**Tally charts / pictographs**:
- Container: `bg-brand-cream rounded-card p-4 mx-5`
- Labels: `font-mono text-xs text-brand-pencil`
- Data values: `font-mono font-bold text-brand-indigo`

### 6.9 Feedback Overlay

Slides up from bottom after checking an answer. Sits above the Check button area.

**Correct:**
```
bg-brand-success rounded-t-card px-5 py-4
```
- "Correct!" in `font-heading font-bold text-white text-base`
- Optional explanation in `font-body text-white/80 text-sm mt-1`

**Incorrect:**
```
bg-brand-terracotta rounded-t-card px-5 py-4
```
- "Not quite!" in `font-heading font-bold text-white text-base`
- "The answer was: 8" in `font-body text-white/80 text-sm mt-1`

**Animation:**
```tsx
<motion.div
  initial={{ y: 100 }}
  animate={{ y: 0 }}
  transition={{ type: "spring", stiffness: 400, damping: 28 }}
/>
```

### 6.10 Celebrations

| Trigger | Effect |
|---------|--------|
| Correct answer | Feedback overlay + Owlbert celebrating state (0.5s) |
| 3-streak | Small star burst around XP counter (CSS particles or Framer Motion) |
| 5-streak | `canvas-confetti` burst — `{ particleCount: 60, spread: 55, origin: { y: 0.3 }, colors: ['#3D5A80', '#C4613A', '#D4943D', '#5A7353'] }` |
| Session complete (≥ 80%) | Full confetti + XP rolling counter + star rating + Owlbert trophy state |
| Topic mastered | Gold badge reveal animation, special Owlbert celebration |

### 6.11 Session Flow

**Start screen** (`(play)/session/page.tsx` before quiz begins):
- Topic name in `font-heading font-bold text-xl text-brand-ink`
- Owlbert greeting
- "10 questions · ~5 min" in `font-mono text-sm text-brand-pencil`
- "Start Quest" button (chunky, terracotta)

**Question transitions**: Current question slides left, next slides in from right. `300ms, ease: [0.4, 0, 0.2, 1]`. No scroll.

**Results screen** (after all 10 questions):
- Score: `font-heading font-extrabold text-[48px]` — "8/10" in `text-brand-indigo` (or `text-brand-success` if ≥ 80%)
- Star rating: 3 stars, filled proportionally
- XP earned: "+45 XP" with rolling number animation using `useMotionValue`
- Streak display if applicable
- Two buttons: "Review Mistakes" (secondary/outline) + "Continue" (chunky terracotta)

**Mistake review**: Shows each wrong answer with correct answer highlighted. Owlbert in teaching state.

### 6.12 Non-Game Screens

The kids' app has screens outside the game session: trail map, badges, profile.

**Bottom tab bar** (visible on all non-session screens):
```
fixed bottom-0 h-16 pb-[env(safe-area-inset-bottom,0px)]
bg-brand-parchment-warm/95 backdrop-blur-sm
border-t border-brand-cream-dark
flex items-center justify-around
```

Four tabs:

| Tab | Icon | Label |
|-----|------|-------|
| Trail | 🗺️ | Trail |
| Badges | 🏆 | Badges |
| Profile | 👤 | Me |
| Settings | ⚙️ | Settings |

Active: `text-brand-indigo font-bold`. Inactive: `text-brand-pencil`.

**Trail / Map view** (`(play)/page.tsx`):
Vertical scrolling path showing topic progression. Duolingo-style skill tree with storybook aesthetic.

- Path: 4px SVG wavy line, `stroke-brand-cream-dark`
- Completed node: `w-14 h-14 rounded-full bg-brand-marigold shadow-elevated` with gold ⭐
- Current node: `w-14 h-14 rounded-full bg-brand-indigo animate-pulse-ring` with Owlbert perched
- Locked node: `w-14 h-14 rounded-full bg-brand-cream-dark opacity-50` with 🔒

**Desktop adaptation** (≥ 768px):
Game area stays at `max-w-[480px]` centered. Bottom nav becomes a left sidebar (`w-[220px] bg-brand-cream border-r border-brand-cream-dark`). Surrounding space can show decorative storybook textures or a parent quick-access panel.

---

## 7. Animation Reference

### Parent Platform — Subtle, Professional

| Pattern | Framer Motion Props |
|---------|-------------------|
| Fade up entrance | `initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}` |
| Stagger text | Add `delay: index * 0.08` to transition |
| Stagger cards | Add `delay: index * 0.12` to transition |
| Button hover | `whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}` |
| Scroll trigger | `whileInView` with `viewport={{ once: true, amount: 0.3 }}` |
| Page transition | `initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}` |

### Kids' App — Bouncy, Mechanical, Rewarding

| Pattern | Framer Motion Props |
|---------|-------------------|
| Button press | `whileTap={{ y: 3 }} transition={{ type: "spring", stiffness: 500, damping: 30 }}` |
| Mascot entrance | `initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 300, damping: 24 }}` |
| Answer buttons appear | Stagger 0.06s, `initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}` with spring |
| Correct pulse | `animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 0.2 }}` |
| Incorrect shake | Apply `animate-shake` CSS class for 400ms |
| Progress bar | `animate={{ width: pct + '%' }} transition={{ duration: 0.4, ease: "easeOut" }}` |
| Screen transition | Slide out left, slide in right, 300ms, `ease: [0.4, 0, 0.2, 1]` |
| Feedback overlay | `initial={{ y: 100 }} animate={{ y: 0 }} transition={{ type: "spring", stiffness: 400, damping: 28 }}` |
| XP counter | `useMotionValue` + `useTransform` + `animate` for rolling numbers |

### Audio Cues (Kids Only)

```ts
// lib/sounds.ts
import useSound from 'use-sound'

// Preload in game session layout
const [playTap]        = useSound('/sounds/tap.mp3',        { volume: 0.3 })
const [playCorrect]    = useSound('/sounds/correct.mp3',    { volume: 0.5 })
const [playIncorrect]  = useSound('/sounds/wrong.mp3',      { volume: 0.3 })
const [playCelebrate]  = useSound('/sounds/celebrate.mp3',  { volume: 0.6 })
const [playBadge]      = useSound('/sounds/badge.mp3',      { volume: 0.5 })
```

| Event | Sound | Volume |
|-------|-------|--------|
| Any button tap | `tap.mp3` — soft wood click | 0.3 |
| Answer selected | Implicit (tap sound covers it) | — |
| Correct answer | `correct.mp3` — ascending 2-note chime | 0.5 |
| Incorrect answer | `wrong.mp3` — gentle low tone (not punishing) | 0.3 |
| 5-streak / session win | `celebrate.mp3` — short fanfare | 0.6 |
| Badge earned | `badge.mp3` — metallic ding + shimmer | 0.5 |

---

## 8. Accessibility

### Both Platforms

- WCAG AA contrast: Ink on parchment = 11.5:1 ✓. White on indigo = 5.2:1 ✓. White on terracotta = 4.6:1 ✓.
- `focus-visible` ring on all interactive elements
- Semantic HTML: heading hierarchy, `<button>` for actions, `<a>` for navigation
- `prefers-reduced-motion`: disable all Framer Motion animations, show static states
- Light theme only for MVP. No dark mode.

### Kids' App

- **Audio narrator reads every prompt** — this is a product feature, not just accessibility. 6-year-olds can't read fluently.
- All tap targets ≥ 48x48px (most are 56–64px)
- No time pressure. No question timers.
- State changes use color AND shape/position (not color alone)
- `aria-live="polite"` on the question area so screen readers announce new questions
- `aria-label` on answer buttons describing the full answer context

---

## 9. Build Order

What to build first, and what can wait.

### Phase 1 — Core game loop (build this first)

1. `ChunkyButton` component with all 5 states
2. Game session layout (status bar, progress bar, question area, buttons, check button)
3. One question template working end-to-end (pattern/number-sequence)
4. Feedback overlay (correct/incorrect)
5. Session flow (start → 10 questions → results)
6. API integration (start session, submit answer, get results)

**Milestone**: A kid can play a complete 10-question session on a phone.

### Phase 2 — Game feel

7. Mascot bubble with Owlbert (emoji MVP)
8. Spring animations on buttons and transitions
9. Audio cues (tap, correct, incorrect)
10. Celebration effects (confetti on streaks, session complete)
11. Hearts / lives system

### Phase 3 — Parent platform

12. Marketing landing page (hero, features, philosophy, CTA)
13. shadcn/ui setup with brand theme
14. Parent dashboard (overview, progress, history)
15. Auth (at minimum: one parent account, one kid profile)

### Phase 4 — Polish

16. Trail/map view
17. Badge/achievement system
18. Owlbert SVG assets (replace emoji)
19. Sound design (replace placeholder audio)
20. PWA manifest + service worker

---

## 10. Quick Reference Card

Paste this into a fresh Claude Code session to establish context:

```
STORY QUEST DESIGN SYSTEM — QUICK REFERENCE

Brand: Story Quest — educational gaming for kids, marketed to parents
Mascot: Owlbert the owl — guide in kids' app, cameo on web

Colors:
  Indigo #3D5A80 (primary) / Light #5A7BA8 / Dark #2E4563
  Terracotta #C4613A (accent) / Light #D4784F / Dark #9A4C2D
  Marigold #D4943D (secondary — streaks, warmth)
  Parchment #FBF7F0 (web bg) / Warm #FDF8F2 (kids bg) / Dark #EDE8DF
  Cream #F5F0E6 (cards) / Dark #DDD6CA (borders)
  Ink #2D2A26 (text) / Pencil #9B9088 (muted)
  Success #5A7353 / Dark #3F5239

Fonts: Nunito (headings + kids body), Lora Italic (parent hero only),
       IBM Plex Mono (stats/numbers)

Stack: Single Next.js 15 app, route groups for separation
  (marketing)/  — parent landing page, shadcn/ui
  (dashboard)/  — parent progress tracking, shadcn/ui
  (play)/       — kids' game, custom components only
  Tailwind CSS v4, Framer Motion, use-sound, canvas-confetti

Kids' game key rules:
  - Duolingo-style chunky 3D buttons (3px shadow, press-in on tap)
  - Nunito everywhere, no serif
  - Spring animations (bouncy, mechanical)
  - Status bar: hearts + streak + XP
  - 480px max game width on desktop
  - No noise overlay on mobile
  - Audio narrator reads all prompts

Backend: existing Flask API at edtech-api/ — Next.js is frontend only

Full spec: Projects/Ed Tech/story-quest-style-guide.md
Curriculum: Projects/Ed Tech/grade1-learning-system.md
``