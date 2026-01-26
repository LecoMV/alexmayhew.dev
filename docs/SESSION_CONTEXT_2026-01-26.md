# Session Context - alexmayhew.dev (2026-01-26)

> **Purpose:** Context recovery document for `/clear` sessions
> **Last Updated:** 2026-01-26 18:10 UTC
> **Status:** Ready for new session

---

## Project Summary

**Domain:** alexmayhew.dev
**Type:** Technical Advisor portfolio & lead generation engine
**Deployment:** OpenNext → Cloudflare Pages

## Current State

### Completed Work

| Component  | Status      | Details                                               |
| ---------- | ----------- | ----------------------------------------------------- |
| pSEO Route | ✅ Done     | `/services/[slug]/page.tsx` with generateStaticParams |
| Hub Page   | ✅ Done     | `/services/page.tsx` with filtering                   |
| pSEO Pages | ✅ 21 pages | Tech+Industry combinations                            |
| llms.txt   | ✅ Done     | AI agent discovery file                               |
| JSON-LD    | ✅ Done     | Service, FAQ, WebPage, Breadcrumb                     |
| Sitemap    | ✅ Done     | Auto-includes all service pages                       |
| Blog Posts | 19 posts    | Supporting internal linking                           |
| TraceForge | ✅ Done     | GPU vectorizer at `/tools/traceforge`                 |

### Next Work (P1 Beads)

```bash
bd ready  # Shows available work
```

| Bead      | Description                | Priority            |
| --------- | -------------------------- | ------------------- |
| amdev-cqy | migrations.ts data file    | P1                  |
| amdev-3nt | integrations.ts data file  | P1                  |
| amdev-nga | Migration page route       | P1 (blocked by cqy) |
| amdev-65k | Integration page route     | P1 (blocked by 3nt) |
| amdev-79j | Technology Hub Pages       | P1                  |
| amdev-6qf | Role-based Founder Pages   | P1                  |
| amdev-kgm | Initialize Sentry          | P1                  |
| amdev-71k | Core Web Vitals monitoring | P1                  |

## Key Commands

```bash
# Development
SKIP_CF_DEV=1 PORT=3001 npm run dev

# Beads
bd ready              # Available work
bd show <id>          # Issue details
bd update <id> --status=in_progress
bd close <id>         # Complete
bd sync               # Push to git

# Memory recall
/recall "amdev pseo"
```

## Key Files

| File                          | Purpose               |
| ----------------------------- | --------------------- |
| `CLAUDE.md`                   | Project instructions  |
| `docs/IMPLEMENTATION_PLAN.md` | Master roadmap        |
| `MARKETING_PLAN_2026.md`      | Go-to-market strategy |
| `docs/BLOG_CONTENT_IDEAS.md`  | Content tracker       |
| `src/data/pseo/`              | pSEO data layer       |

## Research Documents

| Document             | Location                                                                |
| -------------------- | ----------------------------------------------------------------------- |
| Gemini pSEO Research | `/home/deploy/projects/amdev/Gemini_Research_pSEO+Site-Enhancements.md` |
| Copy Audit Report    | `docs/COPY_AUDIT_REPORT.md`                                             |

## Learnings in PostgreSQL

Query with:

```bash
/recall "amdev pseo"
/recall "amdev beads"
/recall "amdev cloudflare wrangler"
```

## Git Status

- Remote: `git@github.com:LecoMV/alexmayhew.dev.git` (SSH)
- Branch: `main`
- Last commit: `docs: update implementation plan with accurate 21-page count`

## Session Recovery Steps

1. Run `bd prime` (or `bd ready`) to see available work
2. Check `bd list --status=in_progress` for any claimed work
3. Read `CLAUDE.md` for project context
4. Read `docs/IMPLEMENTATION_PLAN.md` for roadmap
5. Start with highest priority unblocked bead

---

## Quick Context for Claude

```
This is alexmayhew.dev - a technical advisor portfolio using Next.js 15 + Tailwind + Framer Motion
deployed to Cloudflare Pages via OpenNext.

21 pSEO service pages are live at /services/[slug]. Next work is creating Legacy Migration
and SaaS Integration verticals (migrations.ts, integrations.ts data files).

Use SKIP_CF_DEV=1 PORT=3001 npm run dev for local development.
Beads are in .beads/ - use bd commands for issue tracking.
```
