# alexmayhew.dev - Claude Code Project Instructions

> **Last Updated:** 2026-01-27
> **Status:** Production - GitHub Actions CI/CD Active
> **Epic:** amdev-183 (2026 Marketing Launch Plan)

## Project Identity

**Domain:** alexmayhew.dev
**Purpose:** Technical Advisor portfolio & lead generation engine
**Philosophy:** "Atmospheric Engineering" - High-precision digital instruments, tactile and heavy
**Aesthetic:** Neo-Brutalist, anti-AI-generic, handcrafted feel
**Positioning:** Technical Advisor (NOT freelancer) - strategic guidance, not just code

## Current State (2026-01-26)

### ✅ Completed (Phase 2 pSEO - DONE)

- 21 pSEO service pages live at `/services/[slug]`
- Services hub page at `/services` with 3-tier framework
- 8 Technology hub pages at `/technologies/[slug]`
- Technologies hub at `/technologies`
- JSON-LD structured data (Service, FAQ, WebPage, Breadcrumb, ItemList)
- `llms.txt` for AI agent discovery
- Sitemap includes all pages (services + technologies)
- Internal linking from 18 blog posts to service pages
- GA4 conversion tracking on contact form
- TraceForge tool at `/tools/traceforge`
- Claude Pilot tool at `/tools/pilot`
- Case studies rewritten with ROI focus
- Copy audit documented in `docs/COPY_AUDIT_REPORT.md`

### ✅ Recently Completed

- **GitHub Actions CI/CD** - Automatic deployment on push to main
- **Role-based pages** - `/for/cto`, `/for/technical-founder`, etc.
- **Legacy migrations** - Drupal 7, ASP.NET Web Forms
- **SaaS integrations** - Shopify-Klaviyo, Stripe-HubSpot
- **Copy audit** - Freelancer → Technical Advisor positioning

### 🚧 P1 Remaining (Do Next)

- **amdev-71k**: Add Core Web Vitals monitoring
- **Error monitoring** - Need Cloudflare-compatible solution (not Sentry - incompatible with Workers)

### 📋 P2 Enhancements (Nice to Have)

- **amdev-8th**: Supporting blog posts for pSEO internal linking
- **amdev-ukt**: Custom share buttons for blog posts
- **amdev-kph**: Interactive terminal feature
- **amdev-bzm**: WebGL neural field background
- **amdev-8gr**: AI chat assistant (Cloudflare Workers AI)

### 📋 Key Documentation

- `docs/DEPLOYMENT.md` - **CI/CD and deployment guide (READ THIS FIRST)**
- `MARKETING_PLAN_2026.md` - Full go-to-market strategy
- `docs/IMPLEMENTATION_PLAN.md` - Phase-by-phase roadmap
- `docs/COPY_AUDIT_REPORT.md` - 24 copy changes needed (Freelancer → Technical Advisor)
- `docs/BLOG_CONTENT_IDEAS.md` - Supporting content tracker
- `docs/FEATURE_IMPLEMENTATION_PLAN.md` - Terminal, WebGL, AI chat specs
- `docs/PORTFOLIO_PRODUCTS_STRATEGY.md` - TraceForge, Claude Pilot showcase
- `/home/deploy/projects/amdev/Gemini_Research_pSEO+Site-Enhancements.md` - Agentic SEO research

## Issue Tracking (Beads)

This project uses **project-level beads** stored in `.beads/`. Issue IDs prefixed with `amdev-`.

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
# Development server (skip Cloudflare bindings for faster local dev)
SKIP_CF_DEV=1 PORT=3001 npm run dev

# Development with Cloudflare bindings (requires wrangler OAuth login)
CLOUDFLARE_API_TOKEN=$(pass show claude/cloudflare/api-token) PORT=3001 npm run dev

npm run build      # Production build
npm run preview    # Preview on Cloudflare runtime locally
npm run lint       # ESLint check

# DEPLOYMENT IS AUTOMATIC VIA GITHUB ACTIONS
# Just push to main branch - DO NOT run npm run deploy manually
git push origin main
```

## Deployment (CRITICAL - READ THIS)

### How Deployment Works

**THIS PROJECT USES GITHUB ACTIONS FOR DEPLOYMENT. DO NOT DEPLOY MANUALLY.**

```
Local Dev → git push → GitHub Actions → Cloudflare Pages
```

1. **Commit locally** - Normal git workflow
2. **Push to GitHub** - Triggers GitHub Actions
3. **Automatic deployment** - GitHub Actions builds and deploys to Cloudflare
4. **Health checks** - Automatic verification after deploy
5. **Rollback** - Via Cloudflare Dashboard if needed

### Deployment Workflow

| Trigger        | Action                    | Environment     |
| -------------- | ------------------------- | --------------- |
| Push to `main` | Auto-deploy to production | alexmayhew.dev  |
| Pull Request   | Auto-deploy preview       | PR-specific URL |
| Manual         | **NEVER DO THIS**         | -               |

### What Happens on Push to Main

1. **Validate** - typecheck, lint, build
2. **Build OpenNext** - Creates Cloudflare-compatible bundle
3. **Deploy** - Pushes to Cloudflare Pages
4. **Health Check** - Verifies `/api/health` returns 200
5. **Smoke Tests** - Checks critical pages (/, /services, /for, /contact)
6. **Notify** - Creates GitHub issue if deployment fails

### GitHub Secrets Required

These must be configured in GitHub repository settings:

| Secret                  | Description                          | Where to Get                      |
| ----------------------- | ------------------------------------ | --------------------------------- |
| `CLOUDFLARE_API_TOKEN`  | API token with Pages Edit permission | Cloudflare Dashboard → API Tokens |
| `CLOUDFLARE_ACCOUNT_ID` | Account identifier                   | Cloudflare Dashboard → Overview   |

### Rollback Procedure

If a deployment breaks production:

1. **Cloudflare Dashboard** → Workers & Pages → alexmayhew-dev → Deployments
2. Find the last working deployment
3. Click "..." → "Rollback to this deployment"
4. Fix the issue locally, push a new commit

### Common Deployment Errors

| Error               | Cause                       | Fix                                         |
| ------------------- | --------------------------- | ------------------------------------------- |
| Health check failed | Runtime error in production | Check Cloudflare logs, rollback if critical |
| Build failed        | TypeScript/ESLint errors    | Fix errors locally, push again              |
| Smoke test failed   | Page returns non-200        | Check specific page, may need rollback      |

### NEVER DO THIS

```bash
# WRONG - Do not deploy manually
npm run deploy           # ❌ DON'T DO THIS
npx wrangler deploy      # ❌ DON'T DO THIS
npx wrangler pages deploy # ❌ DON'T DO THIS

# CORRECT - Push to GitHub, let Actions deploy
git push origin main     # ✅ THIS IS THE ONLY WAY TO DEPLOY
```

### Version Tracking

Every deployment includes:

- Git SHA in `/api/health` response
- Build timestamp
- Site version from package.json

Check deployed version:

```bash
curl -s https://alexmayhew.dev/api/health | jq
```

## Development Server Options

**Port 3000 is reserved** (Memgraph Lab), always use `PORT=3001` or higher.

### Option 1: Skip Cloudflare Context (Recommended for most dev work)

```bash
SKIP_CF_DEV=1 PORT=3001 npm run dev
```

- Fastest startup, no authentication required
- Works for all pages that don't need R2, AI, or other CF bindings
- Most UI/component work doesn't need Cloudflare context

### Option 2: With Cloudflare Bindings (For testing R2, AI, etc.)

```bash
# First, authenticate wrangler via OAuth (opens browser)
npx wrangler login

# Then run with bindings
PORT=3001 npm run dev
```

### Troubleshooting

If you see "/memberships API failed":

- The API token in pass doesn't have user-level permissions
- Use `SKIP_CF_DEV=1` for local dev, or run `npx wrangler login` for OAuth
- `account_id` is already set in `wrangler.jsonc` to bypass some auth issues

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

## Pages Structure

### Core Pages (Complete)

| Route               | Purpose                 | Status  |
| ------------------- | ----------------------- | ------- |
| `/`                 | Hero + intro            | ✅ Done |
| `/work`             | Project showcase        | ✅ Done |
| `/about`            | Bio, skills, tech stack | ✅ Done |
| `/contact`          | Contact form            | ✅ Done |
| `/blog`             | 19 technical articles   | ✅ Done |
| `/tools`            | Tools hub               | ✅ Done |
| `/tools/traceforge` | GPU vectorizer          | ✅ Done |

### pSEO Pages (30 Live, 50+ Planned)

| Route Pattern                   | Count | Status                         |
| ------------------------------- | ----- | ------------------------------ |
| `/services`                     | 1     | ✅ Hub page (3-tier framework) |
| `/services/[slug]`              | 21    | ✅ Tech+Industry pages         |
| `/technologies`                 | 1     | ✅ Technology hub              |
| `/technologies/[slug]`          | 8     | ✅ Individual tech pages       |
| `/services/migrations/[slug]`   | 0     | 🚧 Planned (8-10 pages)        |
| `/services/integrations/[slug]` | 0     | 🚧 Planned (5-8 pages)         |
| `/for/[role]`                   | 0     | 🚧 Planned (4 pages)           |

### pSEO Data Files

```
src/data/pseo/
├── index.ts          # Exports and utilities
├── types.ts          # TypeScript interfaces
├── validation.ts     # Zod schemas
├── pages.ts          # 21 service pages
├── technologies.ts   # 8 technology definitions
├── industries.ts     # 10 industry definitions
├── migrations.ts     # 🚧 TODO: Legacy migration data
└── integrations.ts   # 🚧 TODO: SaaS integration data
```

## OpenNext Technical Requirements (CRITICAL)

### R2 Incremental Cache Binding

The R2 bucket binding in `wrangler.jsonc` **MUST** be named exactly `NEXT_INC_CACHE_R2_BUCKET`:

```jsonc
// wrangler.jsonc - CORRECT
"r2_buckets": [
  {
    "binding": "NEXT_INC_CACHE_R2_BUCKET",  // ✅ Exact name required
    "bucket_name": "alexmayhew-dev-cache"
  }
]
```

Using any other name (like `NEXT_CACHE`) will cause deployment failure.

### Edge Runtime Restriction

**API routes cannot use `export const runtime = "edge"` with OpenNext.**

```typescript
// ❌ WRONG - Will fail OpenNext build
export const runtime = "edge";

// ✅ CORRECT - Let OpenNext handle runtime
// (no runtime export)
```

### GitHub Actions Artifact Upload

The `.open-next/` directory starts with a dot, so `actions/upload-artifact@v4` needs:

```yaml
- uses: actions/upload-artifact@v4
  with:
    path: .open-next/
    include-hidden-files: true # ← Required for .open-next
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

## pSEO Implementation Guide

### Quality Gates (Non-Negotiable)

Per MARKETING_PLAN_2026.md, every pSEO page must have:

- 5+ unique insights (50+ chars each)
- 150+ words in `whyThisStack`
- 150+ words in `projectApproach`
- 3+ industry regulations (if applicable)
- 5+ pain points with solutions
- 4+ FAQs
- SEO title 30-70 chars
- SEO description 100-170 chars

### Adding New pSEO Pages

1. Add page data to `src/data/pseo/pages.ts`
2. Run validation: `npm run build` (will fail if quality gates not met)
3. Verify JSON-LD in browser dev tools
4. Check internal links to related pages

### Key Research Documents

- **Gemini Research:** `/home/deploy/projects/amdev/Gemini_Research_pSEO+Site-Enhancements.md`
  - Agentic Optimization (AIO) strategy
  - llms.txt standard
  - Legacy Migration Vertical (Vertical A)
  - SaaS Integration Vertical (Vertical B)
- **Marketing Plan:** `MARKETING_PLAN_2026.md`
  - 5-phase go-to-market strategy
  - Positioning: Freelancer → Technical Advisor
  - Content calendar and metrics

## Quick Reference - Beads

```bash
# See available work (no blockers)
bd ready

# Key P1 beads
bd show amdev-d65   # Copy audit changes (Freelancer → Technical Advisor)
bd show amdev-cqy   # Migrations data file
bd show amdev-3nt   # Integrations data file
bd show amdev-6qf   # Role-based founder pages
bd show amdev-kgm   # Sentry initialization

# Completed beads (reference)
bd show amdev-9z1   # ✅ Phase 2 pSEO (CLOSED)
bd show amdev-79j   # ✅ Technology hub pages (CLOSED)
```

## Git Workflow

```bash
# Always use SSH for this repo
git remote set-url origin git@github.com:LecoMV/alexmayhew.dev.git

# Session end protocol
git add <files>
bd sync
git commit -m "feat(pseo): ..."
git push
```
