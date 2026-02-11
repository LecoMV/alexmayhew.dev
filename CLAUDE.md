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

See `.claude/rules/deployment.md` for critical requirements.

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
content/blog/               # Blog posts (MDX) - 44 posts total
docs/                       # Implementation docs
.claude/rules/              # Modular Claude rules
```

## Content Architecture (Hub-and-Spoke)

5 hub guides + 39 spoke posts. Hub posts: `isHub: true`. Spoke posts: `series: "[cluster-name]"`.

| Hub                                    | Series Key                | Spokes |
| -------------------------------------- | ------------------------- | ------ |
| SaaS Architecture Decision Framework   | `saas-architecture`       | 11     |
| Engineering Leadership: Founder to CTO | `engineering-leadership`  | 6      |
| Modern Frontend Architecture           | `frontend-architecture`   | 8      |
| Performance Engineering Playbook       | `performance-engineering` | 8      |
| AI-Assisted Development Guide          | `ai-development`          | 6      |

See `docs/CONTENT_STATUS.md` for full inventory.

## Credentials

```bash
# LLM APIs for content repurposing
pass show claude/groq/api-key           # Groq (Llama 3.3 70B, 14,400 req/day free)
pass show claude/cloudflare/api-token   # Cloudflare Workers AI (already in wrangler)
pass show claude/n8n/api-key            # n8n workflow automation

# Newsletter (Listmonk — self-hosted at localhost:9000)
pass show claude/listmonk/admin-password  # Listmonk admin + API password
pass show claude/resend/api-key           # Resend SMTP (used by Listmonk)
```

## Content Pipeline

- **n8n Webhook:** `http://localhost:5678/webhook/content-repurpose` — see `docs/N8N_SETUP_GUIDE.md`
- **LLM Stack:** Ollama + Gemma 2 9B (local), Groq API (cloud), n8n (automation) — see `docs/SELF_HOSTED_LLM_GUIDE.md`

## Content Operations

**Cadence:** 2 blog posts/month + weekly newsletter + 4 LinkedIn/week (Mon-Thu) + 3 X tweets/week (Tue-Thu) + bi-weekly Dev.to.

**Start here:** `docs/CONTENT_PLATFORM_REFERENCE.md` (master reference for all content work)

**Quality gates:** Blog: `docs/BLOG_QUALITY_CHECKLIST.md` | Newsletter: `content/newsletter/QUALITY_CHECKLIST.md` | Voice: `docs/VOICE_GUIDE.md`

## References

**Master docs** (start here — they link to everything else):

- Content: `docs/CONTENT_PLATFORM_REFERENCE.md`
- Architecture: `docs/IMPLEMENTATION_PLAN.md`
- Social: `docs/CROSS_PLATFORM_CONTENT_STRATEGY.md`
- Marketing: `MARKETING_PLAN_2026.md`
- Deployment: `docs/DEPLOYMENT.md`

## Social Media Quick Reference

**Brand Voice:** Technical Precision, Direct & Authoritative, Business Context First, Experienced Perspective, Dense Information, Contrarian When Warranted

**Never use:** Emojis, "game-changer", "perhaps/maybe", "just/simply", exclamation points

**LinkedIn:** 4/week Mon-Thu 10:00 AM EST. 1,000-1,300 chars, no links in body, end with question.

**X/Twitter:** 3/week Tue-Thu 12:00 PM EST. <280 chars, no links/hashtags. 70-80% engagement for new accounts.

**Cross-Platform:** Same source, different voice. Never verbatim cross-post. See `docs/CROSS_PLATFORM_CONTENT_STRATEGY.md`.

**Automation:** Postiz (`localhost:4007`), n8n (`localhost:5678`)
