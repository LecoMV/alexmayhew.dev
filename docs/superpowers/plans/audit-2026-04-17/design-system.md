# Design System Audit — 2026-04-17

## P0

1. `src/components/ui/command-palette.tsx:80` — `bg-black/60` → `bg-void-navy/60` (global component, high visibility)
2. `src/components/blog/layouts/terminal-layout.tsx:31` — `bg-red-500/60` → `bg-burnt-ember/60`
3. `src/components/blog/table-of-contents.tsx:29-33,355,402` — raw hex colors (`#4ade80`, `#facc15`, `#60a5fa`, `#c084fc`, `#22d3ee`, `rgba(204,243,129,0.05)`) → add to `globals.css @theme` as TOC semantic tokens

## P1 — Arbitrary Tailwind values (~75 hits across 15 files)

Consolidate into `globals.css @theme`:

- `--text-micro: 0.625rem` (10px — pervasive)
- `--text-nano: 0.5rem` (8px)
- `--size-hero-min: 60vh` (error/404/offline pages)
- `--size-chat-widget-w/h: 380px/500px`
- `--size-nav-dropdown: 280px`
- `--tracking-spaced: 0.2em`

Hot files:

- Error/404/offline pages (`min-h-[60vh]` x5)
- `chat-widget.tsx` (`h-[500px] w-[380px] max-w-[260px]`)
- `command-palette.tsx`, `navigation.tsx`, `traceforge/*`, `cards-layout.tsx`

## P1 — Linear transitions (`transition-colors duration-*` without `ease-*`)

~30+ hits. Add `ease-out` or promote to Framer Motion with shared spring config:

- `home-page.tsx` (8 hits)
- `services/[slug]/service-page-content.tsx` (10+ hits)
- `services-page-content.tsx`, `error.tsx`, `demo/error.tsx`

## P1 — `rounded-full` for status dots (6 hits)

Options: (a) switch to `rounded-sm` for consistency, (b) whitelist pattern in design-system.md

- `footer.tsx:150`, `terminal-layout.tsx:31-33`, `system-status.tsx:38,191`

## P2 — Missing focus rings (~30+ buttons across 7 files)

Fix by adding `focus-visible:ring-2 focus-visible:ring-cyber-lime focus-visible:outline-none` to shared `<Button>` primitive:

- `blog/table-of-contents.tsx` (5)
- `blog/blog-list.tsx` (3)
- `traceforge/result-viewer.tsx` (9)
- `traceforge/preset-selector.tsx` (3)
- `traceforge/traceforge-app.tsx` (3)
- `terminal/terminal.tsx` (3)
- `pseo/faq-accordion.tsx` (2)

## P2 — Inline `style={{}}` color overrides bypass token system

`blog/table-of-contents.tsx` (11 hits) — extensive inline color overrides from theme objects; by design for swappable blog themes but hardcoded `rgba(204,243,129,0.05)` should reference `theme.colors.accent` with alpha.

## Clean (zero violations)

- `shadow-*`, `rounded-lg|xl|2xl|3xl`, `text-black`/`bg-black`, Framer `ease: "linear"`

## Highest-leverage fixes

1. Add `--text-micro`, `--text-nano`, `--size-hero-min` tokens → eliminates ~40 arbitrary values
2. Bake focus ring into `<Button>` primitive → resolves a11y debt in one edit
