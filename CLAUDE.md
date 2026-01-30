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

**Status:** ✅ Complete (2026-01-28)

The blog uses a hub-and-spoke model with 5 comprehensive guide hubs and 39 spoke posts.

| Hub                                    | Series Key                | Spokes |
| -------------------------------------- | ------------------------- | ------ |
| SaaS Architecture Decision Framework   | `saas-architecture`       | 11     |
| Engineering Leadership: Founder to CTO | `engineering-leadership`  | 6      |
| Modern Frontend Architecture           | `frontend-architecture`   | 8      |
| Performance Engineering Playbook       | `performance-engineering` | 8      |
| AI-Assisted Development Guide          | `ai-development`          | 6      |

**Key Features:**

- Hub posts have `isHub: true` in frontmatter
- Spoke posts have `series: "[cluster-name]"` in frontmatter
- "Comprehensive Guides" section on /blog shows all hubs
- Cross-cluster linking for meta-framework posts
- All pSEO service pages link to relevant hubs

See `docs/CONTENT_STATUS.md` for full content inventory and linking structure.

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

## Content Repurposing Pipeline

**n8n Webhook:** `http://localhost:5678/webhook/content-repurpose`

```bash
# Test the pipeline
curl -X POST http://localhost:5678/webhook/content-repurpose \
  -H "Content-Type: application/json" \
  -d '{"title": "Post Title", "slug": "url-slug", "content": "Blog content..."}'
```

**Output:** LinkedIn carousel, Twitter thread, Newsletter section, Dev.to article

See `docs/N8N_SETUP_GUIDE.md` for full setup and troubleshooting.

## LLM Stack

See `docs/SELF_HOSTED_LLM_GUIDE.md` for details.

- **Local:** Ollama + Gemma 2 9B (RTX 3080 10GB)
- **Cloud:** Groq API (free), Cloudflare Workers AI (free 10K neurons/day)
- **Automation:** n8n (Podman container at localhost:5678)

## Content Operations

**Cadence:** 2 blog posts/month (spokes) + weekly newsletter + automated social distribution.
**Rhythm:** Week A = blog + newsletter. Week B = newsletter only. See `docs/CONTENT_OPERATIONS.md`.

**Start here for content work:**

- **Operations workflow:** `docs/CONTENT_OPERATIONS.md` (end-to-end process)
- **Editorial calendar:** `docs/EDITORIAL_CALENDAR_2026.md` (what to write and when)
- **Content inventory:** `docs/CONTENT_STATUS.md` (hub-and-spoke status)

**Quality gates:**

- Blog posts: `content/blog/QUALITY_CHECKLIST.md`
- Newsletter issues: `content/newsletter/QUALITY_CHECKLIST.md`
- Voice reference: `docs/VOICE_GUIDE.md`

## References

### Core

- Architecture: `docs/IMPLEMENTATION_PLAN.md`
- Deployment: `docs/DEPLOYMENT.md`
- Claude Config: `docs/CLAUDE_CODE_CONFIG.md`

### Content

- Content Status: `docs/CONTENT_STATUS.md` (hub-and-spoke inventory)
- Voice Guide: `docs/VOICE_GUIDE.md` (brand voice for all content)
- Hub Strategy: `docs/HUB_AND_SPOKE_CONTENT_STRATEGY.md`
- Newsletter Strategy: `docs/NEWSLETTER_STRATEGY.md`
- Listmonk Setup: `docs/LISTMONK_SETUP.md`

### Marketing & Repurposing

- n8n Setup: `docs/N8N_SETUP_GUIDE.md`
- LLM Prompts: `docs/LLM_REPURPOSING_PROMPTS.md`
- Content System: `docs/CONTENT_REPURPOSING_SYSTEM.md`
- Implementation Roadmap: `docs/IMPLEMENTATION_ROADMAP.md`
- Marketing Plan: `MARKETING_PLAN_2026.md`

### Technical

- LLM Stack: `docs/SELF_HOSTED_LLM_GUIDE.md`
- Copy Audit: `docs/COPY_AUDIT_REPORT.md`
