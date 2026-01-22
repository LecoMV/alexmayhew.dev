# alexmayhew.dev - Claude Code Project Instructions

## Project Identity

**Domain:** alexmayhew.dev
**Purpose:** Freelance portfolio for full-stack web developer
**Philosophy:** "Atmospheric Engineering" - High-precision digital instruments, tactile and heavy
**Aesthetic:** Neo-Brutalist, anti-AI-generic, handcrafted feel

## Issue Tracking (Beads)

This project uses **project-level beads** stored in `.beads/`. Issue IDs are prefixed with `alexmayhew-dev-`.

```bash
bd ready              # Available work (no blockers)
bd list --status=open # All open issues
bd create --title="..." --type=task --priority=2
bd close <id>         # Mark complete
bd sync               # Sync to git (run at session end)
```

**Memory Labeling:** When saving learnings, use prefix `[amdev]`:

```bash
/learn "[amdev] - Framer Motion spring config for nav"
```

## Tech Stack (Strict)

| Layer           | Technology                  | Version |
| --------------- | --------------------------- | ------- |
| Framework       | Next.js (App Router)        | 15.5.x  |
| React           | React + React DOM           | 19.1.x  |
| Styling         | Tailwind CSS                | 4.x     |
| Animation       | Framer Motion               | 12.x    |
| Smooth Scroll   | Lenis                       | 1.3.x   |
| Icons           | Lucide React                | 0.562.x |
| Deployment      | OpenNext → Cloudflare Pages | 1.14.x  |
| Package Manager | npm                         | -       |

## Commands

```bash
npm run dev        # Development server (Turbopack)
npm run build      # Production build
npm run preview    # Preview on Cloudflare runtime locally
npm run deploy     # Deploy to Cloudflare Pages
npm run lint       # ESLint check
```

## File Structure

```
src/
├── app/
│   ├── layout.tsx       # Root layout (fonts, providers, metadata)
│   ├── page.tsx         # Home page
│   ├── globals.css      # Tailwind + custom theme
│   └── fonts.ts         # Google Fonts (Inter, JetBrains Mono)
├── components/
│   ├── ui/              # Atomic UI components
│   │   └── noise-overlay.tsx
│   └── providers/       # Context providers
│       └── smooth-scroll.tsx
├── lib/                 # Utilities (create as needed)
└── types/               # TypeScript types (create as needed)

public/                  # Static assets
.context/                # Design documentation (read-only reference)
```

## Design System (Enforced)

### Color Palette

```css
--color-void-navy: #0b0e14; /* Background - NEVER pure black */
--color-mist-white: #e2e8f0; /* Primary text */
--color-gunmetal-glass: #1e293b; /* Surfaces, cards */
--color-slate-text: #94a3b8; /* Secondary text */
--color-cyber-lime: #ccf381; /* Primary accent, CTAs, focus */
--color-burnt-ember: #ff6b6b; /* Errors, destructive actions */
```

### Tailwind Usage

```tsx
// Backgrounds
className = "bg-void-navy";
className = "bg-gunmetal-glass";

// Text
className = "text-mist-white";
className = "text-slate-text";
className = "text-cyber-lime";

// Borders (NO shadows)
className = "border border-white/10";
className = "border-cyber-lime";

// Glass effect
className = "backdrop-blur-md bg-gunmetal-glass/20";
```

### Typography

- **Headers:** `font-mono` (JetBrains Mono), `tracking-tight`
- **Body:** `font-sans` (Inter), `tracking-normal`
- **Code/Tech:** `font-mono text-xs`

### Motion (Framer Motion)

```tsx
// REQUIRED: Spring physics, NEVER linear
const springTransition = {
  type: "spring",
  stiffness: 100,
  damping: 20,
  mass: 1
};

// Entrance animation pattern
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={springTransition}
>
```

## Code Rules (Non-Negotiable)

### 1. Read Before Write

Always read existing files before modifying. Check `package.json` before importing.

### 2. Component Structure

```tsx
// Server Component (default)
export function ComponentName() { ... }

// Client Component (only when needed for interactivity)
'use client';
export function InteractiveComponent() { ... }
```

### 3. Semantic HTML

```tsx
// CORRECT
<main><section><article>

// FORBIDDEN
<div><div><div>
```

### 4. Accessibility

- All interactive elements: `aria-label` if no visible text
- Focus states: `focus:ring-2 focus:ring-cyber-lime focus:outline-none`
- Skip links for navigation

### 5. No Placeholders

```tsx
// FORBIDDEN
"Lorem ipsum dolor sit amet...";

// REQUIRED - Tech-themed copy
"Initializing neural handshake...";
"Optimizing edge nodes...";
"System calibration complete.";
```

### 6. Import Paths

```tsx
// Use path alias
import { NoiseOverlay } from "@/components/ui/noise-overlay";

// NOT relative paths from deep nesting
import { NoiseOverlay } from "../../../components/ui/noise-overlay";
```

## Forbidden Patterns

| Pattern                                    | Why                                  | Alternative                              |
| ------------------------------------------ | ------------------------------------ | ---------------------------------------- |
| `rounded-lg`, `rounded-xl`, `rounded-full` | Too soft, breaks brutalist aesthetic | `rounded-sm`, `rounded-md` max           |
| `shadow-*` (any)                           | Diffuse shadows are generic          | `border border-white/10` or glow effects |
| Centered text blocks                       | Magazine-style is preferred          | Asymmetric, left-aligned layouts         |
| Linear animations                          | Feels robotic/cheap                  | Spring physics always                    |
| Pure black `#000`                          | Too harsh                            | `void-navy` (#0B0E14)                    |
| Generic gradients                          | Instagram aesthetic                  | Subtle radial for lighting only          |
| `<div>` soup                               | Bad semantics                        | `<section>`, `<article>`, `<aside>`      |

## Component Patterns

### Button (Standard)

```tsx
<button className="group hover:border-cyber-lime relative border border-white/20 px-6 py-3 transition-colors duration-300">
	<span className="group-hover:text-cyber-lime font-mono text-sm tracking-tight transition-colors">
		BUTTON_TEXT()
	</span>
	<div className="bg-cyber-lime/5 absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
</button>
```

### Card (Glass)

```tsx
<div className="bg-gunmetal-glass/20 border border-white/10 p-6 backdrop-blur-md">
	<div className="border-cyber-lime absolute top-0 right-0 h-3 w-3 border-t border-r" />
	<div className="border-cyber-lime absolute bottom-0 left-0 h-3 w-3 border-b border-l" />
	{/* Content */}
</div>
```

### Section Header

```tsx
<h2 className="text-cyber-lime mb-4 font-mono text-xs tracking-wider uppercase">
	<span className="mr-2 animate-pulse">●</span>
	Section_Name
</h2>
```

## Pages to Build

| Route      | Purpose                       | Priority |
| ---------- | ----------------------------- | -------- |
| `/`        | Hero + intro (exists)         | Done     |
| `/work`    | Project showcase grid         | High     |
| `/about`   | Bio, skills, tech stack       | High     |
| `/contact` | Contact form + Calendly       | High     |
| `/blog`    | Technical articles (optional) | Low      |

## Deployment

### Cloudflare Pages via OpenNext

```bash
# Build and deploy
npm run deploy

# Preview locally on CF runtime
npm run preview
```

### Environment Variables

- Store in `.dev.vars` for local development
- Configure in Cloudflare dashboard for production
- Access via `getCloudflareContext()` in server components

## Testing Checklist

Before committing:

- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds
- [ ] Noise overlay visible on all pages
- [ ] Smooth scroll working
- [ ] No horizontal overflow on mobile
- [ ] Focus states visible on all interactive elements
- [ ] Spring animations on all motion

## Context Files

Read `.context/design-manifesto.md` for detailed aesthetic guidance. This file contains the original design brief from Gemini/Antigravity.

## Notes for Claude Code

1. **This is a portfolio site** - Every pixel matters. Quality over speed.
2. **The aesthetic is intentional** - Don't "fix" the brutalist design choices.
3. **Framer Motion is already installed** - Use it for all animations.
4. **Lenis is already configured** - Don't add another scroll library.
5. **GSAP is NOT installed** - If needed for complex scroll animations, install it.
6. **Server Components by default** - Only use 'use client' when absolutely necessary.
7. **No component libraries** - Build all UI from scratch using Tailwind.
