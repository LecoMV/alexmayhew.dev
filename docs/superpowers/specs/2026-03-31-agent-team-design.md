# Agent Team Design Spec — alexmayhew.dev

**Date:** 2026-03-31
**Status:** APPROVED

---

## Overview

17 specialized Claude Code subagents for alexmayhew.dev, covering SEO, analytics, security, performance, accessibility, content, marketing, DevOps, QA, and design enforcement.

**Architecture:** Flat roster with parallel dispatch. No agent teams orchestration — you are the quality gate for all handoffs. Auditors report, you decide, implementers execute.

**Decisions:**

- **Location:** Project-level (`.claude/agents/`) — checked into git
- **Model:** Opus for all agents
- **Memory:** Persistent project-scoped memory for all agents
- **Tools:** Read-only for audit agents, write access for implementation agents

---

## Audit & Analysis Agents (9 agents, read-only)

### 1. seo-auditor

**Purpose:** Audits on-page SEO — titles, meta descriptions, canonical tags, internal linking, sitemap coverage, crawlability, GSC API data.

**Tools:** Read, Grep, Glob, Bash
**Skills:** tech-seo-audit, schema-markup
**Key context:** Knows the sitemap structure (180 URLs), GSC service account, hub-and-spoke blog architecture (5 hubs, 39 spokes), pSEO pages (services, migrations, integrations, comparisons, technologies, roles). Reports findings with severity levels and specific fix recommendations for seo-implementer.

### 2. schema-auditor

**Purpose:** Audits JSON-LD structured data across all page types. Validates @id consolidation, checks for duplicate entities, verifies schema.org types against current specs.

**Tools:** Read, Grep, Glob
**Skills:** schema-markup
**Key context:** Knows the 17 JSON-LD component files in `src/components/seo/`, the Person/@id pattern, ConsultingService type, BlogPosting for spokes, TechArticle for hubs. Reports entity graph issues and missing schema for handoff.

### 3. analytics-analyst

**Purpose:** Analyzes GA4 data, GSC coverage, traffic patterns, conversion funnels, Consent Mode v2 compliance. Can query GSC API.

**Tools:** Read, Grep, Glob, Bash
**Skills:** analytics-insights
**Key context:** GA4 measurement ID G-K4TLSRKMCV, Consent Mode v2 with region-specific defaults (EEA denied, rest granted), Cloudflare Web Analytics as secondary. GSC service account at project root. Reports data insights and recommendations.

### 4. performance-auditor

**Purpose:** Audits Core Web Vitals (LCP/CLS/INP), bundle sizes, image optimization, render blocking resources, Cloudflare caching, OpenNext configuration.

**Tools:** Read, Grep, Glob, Bash
**Key context:** OpenNext on Cloudflare Pages, R2 cache bucket, smart placement enabled, springTransition shared constants, Framer Motion for animations. Reports specific metrics and bottlenecks.

### 5. security-auditor

**Purpose:** Scans for XSS, injection, CSP gaps, exposed secrets, dependency vulnerabilities, OWASP top 10 against the codebase.

**Tools:** Read, Grep, Glob, Bash
**Skills:** security-pro-pack
**Key context:** CSP configured in layout.tsx, rate limiters in wrangler.jsonc, no hardcoded secrets (pass store), Cloudflare Workers runtime. Reports vulnerabilities with severity and remediation steps.

### 6. accessibility-auditor

**Purpose:** Audits WCAG 2.1 compliance — ARIA labels, focus management, color contrast, semantic HTML, keyboard navigation, skip links, screen reader compatibility.

**Tools:** Read, Grep, Glob
**Key context:** Neo-brutalist design with cyber-lime (#CCF381) on void-navy (#0B0E14) backgrounds. Focus states use `focus:ring-2 focus:ring-cyber-lime`. All interactive elements need aria-label if no visible text.

### 7. code-reviewer

**Purpose:** Reviews code quality, TypeScript strictness, React 19 patterns, Next.js 15 conventions, component hygiene, function length, dead code.

**Tools:** Read, Grep, Glob
**Key context:** Strict mode (no `any`), server components default, `'use client'` only when needed, Zod for validation, 2-space indentation, named exports, max 50-line functions.

### 8. design-enforcer

**Purpose:** Enforces neo-brutalist design system — no shadows, max rounded-md, correct color tokens, spring animations (never linear), semantic HTML, no arbitrary Tailwind values.

**Tools:** Read, Grep, Glob
**Skills:** frontend-design
**Key context:** Design tokens in globals.css via @theme. JetBrains Mono for headers, Inter for body. Border `border-white/10` instead of shadows. Spring physics: stiffness 100, damping 20, mass 1.

### 9. research-analyst

**Purpose:** Deep multi-source research on any topic. Uses all available search tools. Saves findings to `docs/research/` following the research-workflow protocol.

**Tools:** Read, Grep, Glob, Bash, WebSearch
**Skills:** deep-research
**MCP Servers:** nimble-mcp-server
**Key context:** Checks `docs/research/` before starting new research. Saves as `docs/research/<topic-slug>-YYYY.md`. Cross-references multiple sources. Notes confidence levels and freshness.

---

## Implementation Agents (8 agents, write access)

### 10. seo-implementer

**Purpose:** Implements SEO fixes — metadata, canonical tags, JSON-LD components, internal linking, sitemap changes, structured data. Acts on seo-auditor and schema-auditor findings.

**Tools:** Read, Grep, Glob, Write, Edit, Bash
**Skills:** schema-markup
**Key context:** All JSON-LD components in `src/components/seo/`. Sitemap at `src/app/sitemap.ts`. Robots at `src/app/robots.ts`. Must run `npm run build` after changes to verify.

### 11. blog-writer

**Purpose:** Writes blog posts in Alex Mayhew's voice. MDX format with proper frontmatter (title, description, publishedAt, category, tags, series, isHub). Follows hub-and-spoke architecture. Runs voice-rules test after writing.

**Tools:** Read, Grep, Glob, Write, Edit, Bash
**Skills:** alex-voice
**Key context:** 69 existing posts in `content/blog/`. 5 series clusters. Frontmatter validated by Fumadocs. Featured images at `public/images/blog/{slug}-featured.webp`. Must run `npx prettier --write` on MDX before committing. Uses `...` for parenthetical breaks, NEVER em dashes. Contractions mandatory.

### 12. content-writer

**Purpose:** Writes non-blog content — pSEO page copy (uniqueInsights, whyThisStack, projectApproach, FAQs), case study descriptions, tool pages, about page copy. Alex's voice throughout.

**Tools:** Read, Grep, Glob, Write, Edit
**Skills:** alex-voice
**Key context:** pSEO quality gates enforced at build time (5+ unique insights, 150+ words whyThisStack/projectApproach, 3+ regulations, 5+ pain points, 4+ FAQs). Data files in `src/data/pseo/`.

### 13. copywriter

**Purpose:** Writes conversion-focused copy — CTAs, Gumroad product descriptions, email sequences, landing page sections, sales pages. Dense, specific, no fluff. Business context first.

**Tools:** Read, Grep, Glob, Write, Edit
**Skills:** alex-voice
**Key context:** Positioning: "Technical Advisor" not "freelancer." "Partner with me" not "Hire me." Value/outcome-focused. Price range: Advisory Retainer $5K-15K/mo, Strategic Implementation $25K-100K, Technical Due Diligence $5K-25K.

### 14. newsletter-writer

**Purpose:** Writes newsletter issues for The Architect's Brief. MDX format in `content/newsletter/issues/`. One actionable architectural decision per issue. Quality checklist enforced.

**Tools:** Read, Grep, Glob, Write, Edit
**Skills:** alex-voice
**Key context:** 36 existing issues (#005-#036). Listmonk for delivery via Resend SMTP. Quality checklist at `content/newsletter/QUALITY_CHECKLIST.md`. Weekly cadence, Tuesdays.

### 15. social-content-writer

**Purpose:** Creates LinkedIn posts (4/week Mon-Thu 10AM EST) and X/Twitter posts (3/week Tue-Thu 12PM EST). Platform-specific formats and constraints.

**Tools:** Read, Grep, Glob, Write, Edit
**Skills:** alex-voice
**Key context:** LinkedIn: 1000-1300 chars, no links in body, end with question. X: <280 chars, no links/hashtags. Never cross-post verbatim. Never use emojis, "game-changer", "perhaps/maybe", exclamation points. Ellipsis `...` not em dashes.

### 16. devops-engineer

**Purpose:** Manages CI/CD (GitHub Actions), Cloudflare Pages deployment, OpenNext configuration, build optimization, monitoring, health checks, smoke tests.

**Tools:** Read, Grep, Glob, Write, Edit, Bash
**Key context:** Deploy pipeline: push → Actions (typecheck → lint → build → deploy → health → smoke → sitemap validation → IndexNow → GSC). CI uses Node 20, ubuntu-latest. Pinned: next@15.5.9, @opennextjs/cloudflare@~1.14.10. NEVER deploy manually — push to GitHub only.

### 17. qa-tester

**Purpose:** Writes tests (Vitest unit, Playwright E2E), runs test suites, verifies build passes, reports failures with root cause analysis. Reports issues for handoff — does NOT fix production code.

**Tools:** Read, Grep, Glob, Write, Edit, Bash
**Key context:** Vitest for unit/component tests (`tests/`), Playwright for E2E (`e2e/`). TDD Guard enforces red-green-refactor. Test before commit: `npm run build && npx vitest run`. Mock external services. Test edge cases.

---

## Usage Patterns

### Single Agent Invocation

```
"Audit the SEO on the blog pages" → seo-auditor
"Write a blog post about microservices" → blog-writer
"Check the JSON-LD on service pages" → schema-auditor
```

### Parallel Dispatch (Multiple Agents)

```
"Do a full site audit" → launch seo-auditor + performance-auditor +
                          security-auditor + accessibility-auditor in parallel
```

### Audit → Implement Handoff

```
1. seo-auditor finds: "Missing canonical on 5 newsletter pages"
2. You review findings
3. seo-implementer fixes: adds canonical tags to newsletter pages
4. qa-tester verifies: runs build, checks output
```

---

## Success Criteria

- All 17 agents load without errors on session start
- Each agent correctly scoped to its domain (no overlap/confusion)
- Audit agents never modify files
- Implementation agents follow TDD Guard discipline
- alex-voice skill correctly applied by all content agents
- Persistent memory accumulates useful learnings over sessions
