# alexmayhew.dev

> Technical Advisor portfolio & lead generation engine

## Identity

- **Domain:** alexmayhew.dev
- **Stack:** Next.js 15 + React 19 + Tailwind 4 + Framer Motion
- **Deploy:** OpenNext → Cloudflare Pages (GitHub Actions CI/CD)
- **Aesthetic:** Neo-Brutalist, "Atmospheric Engineering"

## Commands

```bash
# Development (Port 3000 reserved for Memgraph)
SKIP_CF_DEV=1 PORT=3001 npm run dev

# Build verification
npm run build && npm run lint

# Issue tracking
bd ready              # Available work
bd show <id>          # Details
bd close <id>         # Complete
bd sync               # Session end
```

## Deployment

**NEVER deploy manually.** Push to GitHub triggers Actions automatically.

```bash
git add <files> && git commit -m "..." && git push origin main
```

See @.claude/rules/deployment.md for critical requirements.

## Design System

| Token               | Value   | Usage                         |
| ------------------- | ------- | ----------------------------- |
| `bg-void-navy`      | #0B0E14 | Background (NEVER pure black) |
| `bg-gunmetal-glass` | #1E293B | Cards, surfaces               |
| `text-mist-white`   | #E2E8F0 | Primary text                  |
| `text-slate-text`   | #94A3B8 | Secondary text                |
| `text-cyber-lime`   | #CCF381 | Accents, CTAs, focus          |
| `text-burnt-ember`  | #FF6B6B | Errors                        |

## Code Rules

1. **Read before write** - Always read existing code first
2. **Server Components default** - Only `'use client'` when needed
3. **Semantic HTML** - `<main>`, `<section>`, `<article>` (not div soup)
4. **Spring animations** - Never linear (Framer Motion)
5. **No shadows** - Use `border border-white/10` instead
6. **No rounded-lg+** - Max `rounded-md` for brutalist aesthetic

## Key Paths

```
src/app/                    # Pages (App Router)
src/components/ui/          # Atomic components
src/components/pages/       # Page-level components
src/data/pseo/              # pSEO data layer (pages, tech, industries)
docs/                       # Implementation docs
.claude/rules/              # Modular Claude rules
```

## Credentials

```bash
# LLM APIs for content repurposing
pass show claude/groq/api-key           # Groq (Llama 3.3 70B, 14,400 req/day free)
pass show claude/cloudflare/api-token   # Cloudflare Workers AI (already in wrangler)
```

**LLM Stack:** See @docs/SELF_HOSTED_LLM_GUIDE.md

- Local: Ollama + Gemma 2 9B (RTX 3080 10GB)
- Cloud: Groq API (free), Cloudflare Workers AI (free 10K neurons/day)

## References

- Architecture: @docs/IMPLEMENTATION_PLAN.md
- Deployment: @docs/DEPLOYMENT.md
- Copy guidelines: @docs/COPY_AUDIT_REPORT.md
- Marketing: @MARKETING_PLAN_2026.md
- LLM Setup: @docs/SELF_HOSTED_LLM_GUIDE.md
- Implementation Roadmap: @docs/IMPLEMENTATION_ROADMAP.md
