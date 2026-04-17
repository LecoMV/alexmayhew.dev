# Design System Enforcement Audit — 2026-04-16

**Auditor:** design-enforcer
**Scope:** `src/components/**`, `src/app/**`, `src/app/globals.css`, `src/lib/motion-constants.ts`
**Design system reference:** `.claude/rules/design-system.md`, `CLAUDE.md` (neo-brutalist, void aesthetic)

## Prior Fixes — Verification

| Fix                                         | Status                                                    | Evidence                                                                                                                                                                                                                      |
| ------------------------------------------- | --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 35 spring transitions applied               | LARGELY LANDED                                            | 184 files use `transition-colors/opacity/transform/all duration-*`, but all `motion.*` uses `springTransition`/`microSpring`/`gentleSpring`/`snappySpringTransition` except 8 delay-only/duration-only remnants (see HIGH-1). |
| 512 ellipsis fixes                          | OUT OF SCOPE for this audit (content) — not verified here |
| `max-w-container` token created             | LANDED as `max-w-content`                                 | `globals.css:16` defines `--max-width-content: 1400px`; 32 files use `max-w-content`; zero matches for `max-w-[1400px]`.                                                                                                      |
| `staggerContainer`/`fadeInUp` deduplication | LANDED                                                    | Only one definition each in `src/lib/motion-constants.ts:26,37`. 9 files consume them via import.                                                                                                                             |
| `m.div` vs `motion.div` (LazyMotion)        | LANDED                                                    | Zero raw `motion.div/section/...` usage. 49 files correctly import `m` from `framer-motion`.                                                                                                                                  |
| `CornerBrackets` DRY                        | LANDED                                                    | Shared component at `src/components/ui/corner-brackets.tsx`, imported in 9 files.                                                                                                                                             |
| `PageLayout` DRY                            | PARTIAL                                                   | No `PageLayout` component exists; DRY solved via `.page-layout` utility in `globals.css:41` (22 files consume). Acceptable — utility class achieves the same result.                                                          |

---

## CRITICAL

### CRITICAL-1 — `bg-black/60` backdrop violates pure-black rule

**File:line:** `src/components/ui/command-palette.tsx:80`

```tsx
<div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
```

**Why:** CLAUDE.md + design-system.md explicitly forbid `bg-black`/`#000`. Site-wide rule is `bg-void-navy` (#0B0E14). Backdrop is the most visible surface at modal open.
**Correct replacement:** `bg-void-navy/80 backdrop-blur-sm` (raise opacity to preserve perceived darkness, since void-navy is slightly lighter than black).

---

## HIGH

### HIGH-1 — Non-spring motion transitions (duration-only or bare `delay`)

These bypass the mandatory spring physics and produce the "robotic/cheap" feel the design system forbids.

| File:line                                           | Offending `transition`                                                                                                        |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `src/app/home-page.tsx:162`                         | `{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }` (cursor blink — acceptable for looping blink; flag as edge case) |
| `src/app/services/services-page-content.tsx:98`     | `{ delay: 0.05 }` (no type, no spring — use `{ ...springTransition, delay: 0.05 }`)                                           |
| `src/app/demo/backgrounds/page.tsx:363`             | `{ delay: 0.5 }`                                                                                                              |
| `src/app/demo/page.tsx:114`                         | `{ delay: 0.2 }`                                                                                                              |
| `src/app/demo/page.tsx:360`                         | `{ delay: 0.5 }`                                                                                                              |
| `src/components/traceforge/preset-selector.tsx:180` | `{ delay: index * 0.05 }`                                                                                                     |
| `src/components/traceforge/progress-log.tsx:102`    | `{ repeat: Infinity, duration: 1 }` (cursor blink — edge case)                                                                |
| `src/components/terminal/terminal.tsx:265`          | `{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }` (cursor blink — edge case)                                       |

**Correct replacement:**

```tsx
import { springTransition } from "@/lib/motion-constants";
transition={{ ...springTransition, delay: 0.05 }}
```

Cursor-blink cases (home:162, progress-log:102, terminal:265) are defensible since springs don't model repeating on/off opacity — mark those three as **ACCEPTED EXCEPTIONS**, but the 5 bare-delay cases are genuine regressions from the prior spring sweep.

### HIGH-2 — Inline spring literals instead of motion-constants tokens

Four locations define spring params inline rather than using `springTransition`/`gentleSpring`/etc. This breaks the token abstraction — if spring params ever tune globally, these escape.

| File:line                                        | Current                                           |
| ------------------------------------------------ | ------------------------------------------------- |
| `src/components/traceforge/gpu-control.tsx:76`   | `{ type: "spring", stiffness: 200, damping: 25 }` |
| `src/components/traceforge/gpu-control.tsx:116`  | same                                              |
| `src/components/traceforge/system-status.tsx:88` | `{ type: "spring", stiffness: 100, damping: 20 }` |
| `src/components/traceforge/upload-zone.tsx:173`  | `{ type: "spring", stiffness: 300, damping: 20 }` |

**Correct replacement:** gpu-control and system-status map to `gentleSpring`/`springTransition`. Upload-zone's (300/20) doesn't match any token — either add `punchySpring` to `motion-constants.ts` or reuse `snappySpringTransition` (300/25).

### HIGH-3 — Off-palette colors (purple/blue/amber/green/yellow/red-500) in product UI

Design tokens are 6 colors (`void-navy`, `gunmetal-glass`, `mist-white`, `slate-text`, `cyber-lime`, `burnt-ember`). These raw Tailwind palette colors create a second, undocumented palette:

| File:line                                                                     | Offending color                                                                                                                                     |
| ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/app/home-page.tsx:146`                                                   | `text-purple-400` (philosophy code block — only purple on site)                                                                                     |
| `src/app/home-page.tsx:143,149`                                               | `text-green-300`, `text-blue-300`                                                                                                                   |
| `src/components/ui/footer.tsx:142`                                            | `bg-green-500` (systems operational dot — should be `bg-cyber-lime`)                                                                                |
| `src/components/blog/layouts/terminal-layout.tsx:31-33`                       | `bg-red-500/60`, `bg-yellow-500/60`, `bg-green-500/60` (macOS traffic-light decorations — arguably intentional pastiche, but still outside palette) |
| `src/app/services/migrations/[slug]/migration-page-content.tsx:201-202`       | `text-yellow-400`, `text-green-400` risk badges                                                                                                     |
| `src/app/services/integrations/[slug]/integration-page-content.tsx:415-416`   | same                                                                                                                                                |
| `src/app/services/comparisons/[slug]/comparison-page-content.tsx` (15+ lines) | `text-amber-400`, `bg-amber-400/*`, `border-amber-400/*` used pervasively for "winner B"                                                            |
| `src/app/demo/page.tsx:30-31,122-129,303,348`                                 | `text-amber-400`, `text-blue-400`, `bg-amber-400/10`, `bg-blue-400/10`                                                                              |
| `src/app/tools/pilot/page.tsx:86`                                             | `text-blue-400`, `border-blue-400/50`                                                                                                               |
| `src/app/tools/traceforge/page.tsx:122,130,134,147`                           | `text-amber-400`, `border-amber-400/20`, `bg-amber-400/5`                                                                                           |
| `src/components/pages/tools-page.tsx:136,157-158`                             | `text-blue-400`, `border-blue-400`                                                                                                                  |
| `src/components/pilot/tech-specs.tsx:98`                                      | `text-amber-400`, `border-amber-400/30`, `bg-amber-400/10`                                                                                          |
| `src/components/pilot/download-buttons.tsx:72-76,109`                         | `text-amber-400` cluster (Windows "coming soon")                                                                                                    |
| `src/components/ui/navigation.tsx:226,367`                                    | `text-blue-400`, `border-blue-400/50`                                                                                                               |
| `src/components/terminal/terminal.tsx:219,241`                                | `text-blue-400`                                                                                                                                     |
| `src/components/traceforge/result-viewer.tsx:73-86,182`                       | `text-green-400`, `text-yellow-400`, `border-green-400/50`, `border-yellow-400/50`                                                                  |
| `src/components/traceforge/preset-selector.tsx:230-300`                       | 7 lines of `text-amber-400`/`bg-amber-400/*`                                                                                                        |
| `src/components/traceforge/progress-log.tsx:43,49`                            | `text-green-400`                                                                                                                                    |
| `src/components/tools/saas-readiness-quiz.tsx:257`                            | `bg-amber-400`                                                                                                                                      |

**Correct replacement:** add semantic tokens to `globals.css` (`--color-warning-amber`, `--color-success-green`, `--color-info-blue`, `--color-caution-yellow`) and reference them. OR consolidate to the existing palette: warnings → `text-burnt-ember`, success → `text-cyber-lime`, neutral-secondary → `text-slate-text`. The "amber" cluster in comparisons and pilot is the worst case — it's effectively a 7th palette color that was never formalized.

### HIGH-4 — `text-purple-400` is unique and indefensible

**File:line:** `src/app/home-page.tsx:146`

```tsx
precision: <span className="text-purple-400">0.9999</span>,
```

Only purple usage on the entire site. Flagged separately from HIGH-3 because it's a one-off regression.
**Correct replacement:** `text-cyber-lime` (numeric literal in a syntax-highlighting pastiche fits the lime accent).

### HIGH-5 — `newsletter-signup.tsx:51` missing `withCorners` pattern

Success state wraps content in a plain `<div>` with corner-brackets omitted — losing the brutalist corner detail used elsewhere for cards. Prior fix added CornerBrackets; this surface is inconsistent.
**File:line:** `src/components/newsletter/newsletter-signup.tsx:48-63`
**Correct replacement:** either use the `<Card>` component or wrap `<CornerBrackets />` inside the `m.div` for visual consistency with the other card variants in the file.

---

## MEDIUM

### MED-1 — Arbitrary width/height values that should be scale tokens

Tailwind v4 still accepts arbitrary values but the design system forbids them. Each of these is justifiable only if no scale token fits — evaluate case-by-case.

| File:line                                              | Arbitrary value                     | Suggested fix                                                                                                                                                 |
| ------------------------------------------------------ | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/components/chat/chat-widget.tsx:174`              | `h-[500px] w-[380px]`               | Define `--size-chat-panel-w: 380px` / `-h: 500px` in `@theme`, or use Tailwind `h-[31.25rem] w-[23.75rem]` if kept but at minimum document why these exact px |
| `src/components/ui/navigation.tsx:205`                 | `min-w-[280px]`                     | `min-w-72` (288px) — closest scale token                                                                                                                      |
| `src/components/traceforge/system-status.tsx:36`       | `min-w-[72px]`                      | `min-w-18` (72px) is a valid scale token in Tailwind v4                                                                                                       |
| `src/components/blog/reading-progress.tsx:4`           | `h-[3px]`                           | `h-0.5` (2px) or `h-1` (4px) — 3px fights the 4px base unit                                                                                                   |
| `src/components/traceforge/result-viewer.tsx:229,234`  | `max-h-[300px] max-w-[200px]`       | `max-h-[18.75rem] max-w-50` or add tokens                                                                                                                     |
| `src/components/ui/command-palette.tsx:107`            | `max-h-[300px]`                     | same                                                                                                                                                          |
| `src/components/ui/command-palette.tsx:72`             | `pt-[20vh]`                         | fractional vh — add `--spacing-modal-top: 20vh` token                                                                                                         |
| `src/components/chat/chat-widget.tsx:218`              | `max-w-[260px]`                     | `max-w-64` (256px) or `max-w-72` (288px)                                                                                                                      |
| `src/components/blog/layouts/cards-layout.tsx:98`      | `aspect-[16/9]`, `lg:min-h-[320px]` | `aspect-video`, `lg:min-h-80`                                                                                                                                 |
| `src/components/blog/layouts/cards-layout.tsx:240,346` | `aspect-[16/9]`                     | `aspect-video`                                                                                                                                                |
| `src/components/blog/table-of-contents.tsx:331`        | `max-h-[calc(100vh-8rem)]`          | acceptable — viewport calc                                                                                                                                    |

### MED-2 — `min-h-[60vh]` repeated across 6 error/offline/not-found pages

**Files:**

- `src/app/error.tsx:20`
- `src/app/not-found.tsx:5`
- `src/app/offline/page.tsx:8`
- `src/app/demo/error.tsx:20`
- `src/app/tools/traceforge/error.tsx:20`
- `src/app/services/[slug]/not-found.tsx`
- `src/app/global-error.tsx`

**Why:** Identical 60vh viewport math duplicated 6 times. DRY + tokenization violation.
**Correct replacement:** extract `.error-screen` utility in `globals.css` or an `<ErrorScreen>` layout component.

### MED-3 — `text-[10px]`, `text-[11px]`, `text-[9px]`, `text-[8px]` micro-type values

40+ occurrences across badges, metadata labels, corner annotations. Tailwind scale has `text-xs` (12px) as the smallest. These micro-sizes are a core brutalist detail (data-label aesthetic), but they should be tokens.

Representative file:lines:

- `src/components/ui/badge.tsx:15` (featured variant `text-[10px]`)
- `src/components/blog/table-of-contents.tsx:212,219,225,369,416,493,523` (7 uses)
- `src/components/ui/navigation.tsx:168,205,223,244,259,364` (multiple)
- `src/app/tools/voice-cloner/page.tsx:257,260,322` (badge row)
- `src/components/pages/case-study-page.tsx:154,163,172,182,253,302,310` (meta labels)
- `src/components/traceforge/preset-selector.tsx:192,214,268,271,280,283,294` (7 uses)
- Dozens more

**Correct replacement:** add tokens to `@theme`:

```css
--font-size-micro: 10px; /* text-micro */
--font-size-nano: 9px; /* text-nano */
--font-size-tag: 8px; /* text-tag */
```

Then replace all `text-[10px]` → `text-micro`, etc. Current state effectively IS a palette, just un-named.

### MED-4 — `rounded-full` used for status dots — acceptable BUT deserves a token

**Files:**

- `src/components/ui/footer.tsx:142` (`h-1.5 w-1.5 ... rounded-full`)
- `src/components/traceforge/system-status.tsx:39,192` (`h-2 w-2 rounded-full`)
- `src/components/blog/layouts/terminal-layout.tsx:31-33` (`h-3 w-3 rounded-full`)

**Why:** design-system.md allows `rounded-full` only for "icons/avatars explicitly." Status dots qualify under the icon exception — no action required, but consider an `.status-dot` utility for consistency.

### MED-5 — `text-white`, `text-white/40`, `bg-white/5`, `bg-white/10`, `border-white/10` bypass token palette

`text-white` is not in the design token list (`text-mist-white` is the canonical primary text color). White-with-alpha is used extensively as a neutral borders/divider system.

Representative:

- `src/app/home-page.tsx:139,152` (`<span className="text-white">`)
- `src/app/services/services-page-content.tsx:311` (`text-white/80`)
- `src/components/pages/work-page.tsx:123`, `case-study-page.tsx:189,409` (`text-white/60`)
- `src/app/home-page.tsx:136` (`text-white/40`), `:158` (`text-white/20`), `:167` (`text-white/10`)
- `src/components/pages/contact-page.tsx:169,185,317` (`placeholder:text-white/30`)

**Why:** `border-white/10` and `bg-white/5` are defensible — they ARE the system's "brutalist seam" pattern. But `text-white` (fully opaque) and multiple opacity tiers of white-as-text should map to tokens: `text-mist-white` for 100%, and the `text-slate-text` (#94A3B8) for ~60% alternative.
**Correct replacement:** Replace fully-opaque `text-white` with `text-mist-white`. Define `--color-seam: rgba(255,255,255,0.1)` token for the repeated `white/10` border pattern.

### MED-6 — `text-[10px] tracking-[0.2em]` on home-page

**File:line:** `src/app/home-page.tsx:167`

```tsx
className = "... font-mono text-[10px] tracking-[0.2em] text-white/10 uppercase";
```

Double arbitrary value. Tracking `0.2em` has no Tailwind scale mapping (`tracking-widest` = `0.1em`).
**Correct replacement:** add `--tracking-brutalist: 0.2em` to `@theme` → `tracking-brutalist`.

### MED-7 — Centered text blocks on error/not-found pages

**Files:** `src/app/not-found.tsx:6`, `src/app/error.tsx:21`, `src/app/offline/page.tsx:9`, `src/app/demo/error.tsx`, `src/app/tools/traceforge/error.tsx`, `src/app/global-error.tsx`, `src/app/services/[slug]/not-found.tsx`

```tsx
<div className="text-center">
```

**Why:** design-system.md forbids centered text blocks in favor of asymmetric magazine-style layouts. Error pages are defensible as focal-point exceptions, but 7 files all use the same pattern — at minimum the 404/error pages could use an asymmetric brutalist "ERROR\_" left-aligned treatment consistent with the rest of the site.

---

## LOW

### LOW-1 — `leading-[1.1]` arbitrary on hero H1

**File:line:** `src/app/home-page.tsx:80`
`leading-tight` (1.25) is closest scale; 1.1 is intentionally tighter for the brutalist hero. Add `--leading-hero: 1.1` to `@theme` → `leading-hero`.

### LOW-2 — `left-[7px]` arbitrary offset in about timeline

**File:line:** `src/components/pages/about-page.tsx:304`
7px doesn't align to the 4px base unit. Use `left-2` (8px) and nudge the timeline dot accordingly, or accept as a known offset and add `--spacing-timeline-offset: 7px` token.

### LOW-3 — `text-green-300`, `text-blue-300` in hero code pastiche

**File:line:** `src/app/home-page.tsx:143,149`
These are inside a code-syntax visual. Arguably intentional pastiche (like VS Code theming). Low priority — if kept, document the exception; if replaced, map to `text-cyber-lime` / `text-slate-text`.

### LOW-4 — `tracking-[0.2em]` shows up in nav micro-labels too

Grep shows the `tracking-wider` (0.05em) class pattern dominates, but `tracking-[0.2em]` appears only on home-page.tsx:167. Resolve via MED-6 token.

### LOW-5 — `aspect-[16/9]` where `aspect-video` exists

**Files:** `src/components/blog/layouts/cards-layout.tsx:98,240,346`
Tailwind v4 ships `aspect-video` = 16/9. Direct swap, zero visual change.

### LOW-6 — `opacity-[0.05]` arbitrary

**File:line:** `src/components/ui/noise-overlay.tsx:5`

```tsx
className = "noise-overlay pointer-events-none fixed inset-0 z-50 opacity-[0.05]";
```

`opacity-5` (0.05) exists in scale. Direct swap.

### LOW-7 — `text-[var(--accent)]` arbitrary CSS variable passthrough

**File:line:** `src/components/blog/blog-list.tsx:149,246`
This is actually fine — it's consuming a theme-layer variable. Flag only because arbitrary syntax is banned. Acceptable exception; document it.

---

## Non-Issues (Confirmed Clean)

- **Zero `shadow-*` classes** across `src/` — brutalist `border border-white/10` pattern held.
- **Zero `rounded-lg`/`rounded-xl`/`rounded-2xl`** in component styles. Only `rounded-full` used, all for icons/status dots (MED-4).
- **Zero `drop-shadow` / `boxShadow` / `box-shadow`** anywhere.
- **Zero `bg-black` except** the one in command-palette (CRITICAL-1).
- **Zero raw `motion.div`** — LazyMotion tree-shaking preserved.
- **Zero `bg-gradient-*`** — generic gradient ban held.
- **Zero `tailwind.config.{js,ts,mjs}`** — v4 `@theme` is sole source.
- **Typography roles correct:** `font-mono` used on headers/data/labels; `font-sans` from the `body` base layer for default body text.
- **Focus rings present** in interactive components — `button.tsx:14`, `contact-page.tsx` form inputs, `chat-widget.tsx:266` all use `focus-visible:ring-2 focus-visible:ring-cyber-lime`.
- **Semantic HTML** — `<section>`, `<nav>`, `<article>` used in all audited page components. No `<div>` soup in top-level page structure.
- **Max-width tokens** — `max-w-content`, `max-w-article`, `max-w-narrow`, `max-w-newsletter` all wired to `@theme`. The 2K/4K overrides in `globals.css:371,383` work.
- **`motion-constants.ts`** — `springTransition`, `snappySpringTransition`, `microSpring`, `gentleSpring`, `staggerContainer`, `fadeInUp` all defined; consumed across the codebase.
- **`.page-layout` utility** — single source in `globals.css:41`, consumed in 22 pages. Replaces prior PageLayout duplication.

---

## Recommended Priority Order

1. **CRITICAL-1** (bg-black/60 in command-palette) — 1-line fix.
2. **HIGH-4** (text-purple-400) — 1-line fix.
3. **HIGH-1** (5 bare-delay transitions) — small, targeted fix; restores spring discipline.
4. **HIGH-2** (4 inline spring literals) — small, targeted fix; re-tokens traceforge subsystem.
5. **HIGH-5** (newsletter success variant missing corner pattern) — component-level.
6. **HIGH-3** (amber/blue/green palette creep) — DESIGN DECISION: either formalize as semantic tokens (`--color-warning`, `--color-success`, `--color-info`) or collapse to existing palette. Largest change, highest system-integrity impact.
7. **MED-3** (text-[10px] micro-type tokens) — tokenize the 40+ uses.
8. **MED-5** (text-white → text-mist-white, white/10 → `--color-seam`) — tokenize neutral system.
9. **MED-2** (extract error-screen utility) — DRY pass on error/404 pages.
10. MED-1, MED-4, MED-6, MED-7, and all LOW items — low-effort batch.

## Summary Counts

| Severity  | Count           |
| --------- | --------------- |
| CRITICAL  | 1               |
| HIGH      | 5               |
| MEDIUM    | 7               |
| LOW       | 7               |
| **Total** | **20 findings** |

Prior fixes held. The neo-brutalist foundation is intact. Remaining drift is concentrated in (a) the traceforge/pilot/comparison subsystems' use of amber/blue/green palette extensions never promoted to tokens, and (b) micro-type/micro-spacing arbitrary values that are effectively unofficial tokens awaiting formalization.
