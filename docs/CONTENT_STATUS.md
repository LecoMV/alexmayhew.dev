# Content Status - alexmayhew.dev

> **Last Updated:** 2026-02-07
> **Status:** Hub-and-Spoke Complete + 16 Drafted Spokes + Newsletter System Implemented

---

## Executive Summary

The alexmayhew.dev blog has been restructured into a **hub-and-spoke content architecture** with 5 comprehensive guide hubs and 39 spoke posts. All internal linking, cross-cluster linking, and featured images are complete.

**Total Content:** 61 blog posts (5 hubs + 39 published spokes + 16 drafted spokes + 1 standalone) + 9 newsletter emails (5 welcome + 4 issues)
**Note:** Spoke counts reflect actual MDX frontmatter `series` values, not topical overlap. `hello-world` is a standalone post (no series). Drafted spokes have `draft: true` in frontmatter and are scheduled for publication Mar 2 – Oct 6, 2026.

---

## Newsletter System — The Architect's Brief

**Status:** Deployed on Listmonk (self-hosted)

### Newsletter Identity

| Attribute | Value                                                    |
| --------- | -------------------------------------------------------- |
| Name      | The Architect's Brief                                    |
| Schedule  | Every Tuesday, 9 AM EST                                  |
| Platform  | Listmonk v6.0.0 (self-hosted at listmonk.alexmayhew.dev) |
| Sender    | Alex Mayhew (alex@alexmayhew.dev)                        |
| Format    | Markdown, 500-700 words per issue                        |
| SMTP      | Resend (smtp.resend.com)                                 |

### Content Infrastructure

```
content/newsletter/
├── buttondown-template.css        # Custom email CSS (neo-brutalist dark theme)
├── TEMPLATE.md                    # Issue template with frontmatter schema
├── QUALITY_CHECKLIST.md           # Pre-send quality gate
├── welcome/                       # 5-email automated welcome sequence
│   ├── 01-welcome.md             # Day 0: Welcome + top 3 blog hubs
│   ├── 02-first-insight.md       # Day 3: Architecture mistake pattern
│   ├── 03-how-i-help.md          # Day 7: Advisory services intro
│   ├── 04-engagement-check.md    # Day 14: Topic preference survey
│   └── 05-case-study.md          # Day 21: Architecture review case study
└── issues/                        # Regular weekly issues
    ├── 001-monolith-first.md     # 2026-02-04 (architecture)
    ├── 002-microservices-cost.md  # 2026-02-11 (architecture)
    ├── 003-postgresql-rls.md     # 2026-02-18 (saas-patterns)
    └── 004-when-not-nextjs.md    # 2026-02-25 (contrarian)
```

### Issue Status

| Issue | Send Date  | Title                                | Pillar        | Status |
| ----- | ---------- | ------------------------------------ | ------------- | ------ |
| #1    | 2026-02-04 | Why Your SaaS Needs a Monolith First | architecture  | Draft  |
| #2    | 2026-02-11 | The Hidden Cost of Microservices     | architecture  | Draft  |
| #3    | 2026-02-18 | PostgreSQL RLS for Multi-Tenancy     | saas-patterns | Draft  |
| #4    | 2026-02-25 | When NOT to Use Next.js              | contrarian    | Draft  |

### Welcome Sequence Status

| Email | Delay     | Subject                                                  | Status |
| ----- | --------- | -------------------------------------------------------- | ------ |
| 1     | Immediate | Welcome to The Architect's Brief                         | Draft  |
| 2     | Day 3     | The architecture mistake I see in every early-stage SaaS | Draft  |
| 3     | Day 7     | How I help CTOs make better architecture decisions       | Draft  |
| 4     | Day 14    | Quick question (2 weeks in)                              | Draft  |
| 5     | Day 21    | The architecture review that saved 6 months              | Draft  |

### Blog Cross-Links from Newsletter

Newsletter content links back to these blog hubs and spokes:

- `saas-architecture-decision-framework` — Issues #1, #2, #3; Welcome #1, #2
- `multi-tenancy-prisma-rls` — Issue #3; Welcome #3, #5
- `performance-engineering-playbook` — Welcome #1
- `ai-assisted-development-guide` — Welcome #1
- `modern-frontend-architecture` — Issue #4

### Documentation

- Setup guide: `docs/LISTMONK_SETUP.md`
- Strategy: `docs/NEWSLETTER_STRATEGY.md`
- Content calendar: `docs/NEWSLETTER_CONTENT_CALENDAR.md`
- Voice guide: `docs/VOICE_GUIDE.md`

---

## Content Architecture

```
                    ┌─────────────────────────────────────┐
                    │         BLOG PAGE                   │
                    │   "Comprehensive Guides" Section    │
                    │      (5 Hub Cards Featured)         │
                    └─────────────┬───────────────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │           │             │             │           │
        ▼           ▼             ▼             ▼           ▼
   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
   │  SaaS   │ │ Eng     │ │Frontend │ │ Perf    │ │   AI    │
   │  Arch   │ │ Leader  │ │  Arch   │ │  Eng    │ │  Dev    │
   │ (13+2)  │ │ (6+4)   │ │ (9+2)   │ │ (5+5)   │ │ (6+3)   │
   └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘
        │           │             │             │           │
        ▼           ▼             ▼             ▼           ▼
    Spoke       Spoke         Spoke         Spoke       Spoke
    Posts       Posts         Posts         Posts       Posts
```

---

## Hub Pages (5 Total)

All hubs marked `isHub: true` in frontmatter and displayed in "Comprehensive Guides" section.

### 1. SaaS Architecture Decision Framework

- **Slug:** `saas-architecture-decision-framework`
- **Series:** `saas-architecture`
- **Spoke Count:** 13 published + 2 drafted = 15 posts
- **Featured Image:** ✅ `saas-architecture-decision-framework-featured.webp`
- **Status:** ✅ Complete (2 drafted spokes publishing Sep–Oct 2026)

### 2. Engineering Leadership: Founder to CTO

- **Slug:** `engineering-leadership-founder-to-cto`
- **Series:** `engineering-leadership`
- **Spoke Count:** 6 published + 4 drafted = 10 posts
- **Featured Image:** ✅ `engineering-leadership-founder-to-cto-featured.webp`
- **Status:** ✅ Complete (4 drafted spokes publishing May–Sep 2026)

### 3. Modern Frontend Architecture

- **Slug:** `modern-frontend-architecture`
- **Series:** `frontend-architecture`
- **Spoke Count:** 9 published + 2 drafted = 11 posts
- **Featured Image:** ✅ `modern-frontend-architecture-featured.webp`
- **Status:** ✅ Complete (2 drafted spokes publishing Jul–Aug 2026)

### 4. Performance Engineering Playbook

- **Slug:** `performance-engineering-playbook`
- **Series:** `performance-engineering`
- **Spoke Count:** 5 published + 5 drafted = 10 posts
- **Featured Image:** ✅ `performance-engineering-playbook-featured.webp`
- **Status:** ✅ Complete (5 drafted spokes publishing Mar–Jul 2026)

### 5. AI-Assisted Development Guide

- **Slug:** `ai-assisted-development-guide`
- **Series:** `ai-development`
- **Spoke Count:** 6 published + 3 drafted = 9 posts
- **Featured Image:** ✅ `ai-assisted-development-guide-featured.webp`
- **Status:** ✅ Complete (3 drafted spokes publishing Mar–Jun 2026)

---

## Spoke Posts by Cluster

### SaaS Architecture (13 published + 2 drafted)

| Post                             | Status                    |
| -------------------------------- | ------------------------- |
| multi-tenancy-prisma-rls         | ✅ Linked                 |
| zero-to-10k-mrr-saas-playbook    | ✅ Linked                 |
| 500k-architecture-mistake        | ✅ Linked                 |
| anatomy-of-high-precision-saas   | ✅ Linked                 |
| multi-region-saas-architecture   | ✅ Linked                 |
| rest-api-design-mistakes         | ✅ Linked                 |
| soc2-compliance-startup-roadmap  | ✅ Linked                 |
| tech-stack-capital-allocation    | ✅ Linked + Cross-cluster |
| build-vs-buy                     | ✅ Linked + Cross-cluster |
| boring-technology-wins           | ✅ Linked + Cross-cluster |
| database-query-optimization      | ✅ Linked                 |
| event-driven-architecture-saas   | ✅ Linked                 |
| saas-reliability-monitoring      | ✅ Linked                 |
| hidden-tax-supporting-both       | 📝 Draft (publish Sep 22) |
| saas-billing-stripe-architecture | 📝 Draft (publish Oct 6)  |

### Engineering Leadership (6 published + 4 drafted)

| Post                            | Status                    |
| ------------------------------- | ------------------------- |
| ic-to-tech-lead                 | ✅ Linked                 |
| fractional-cto-vs-full-time     | ✅ Linked                 |
| senior-developer-paradox        | ✅ Linked + Cross-cluster |
| first-engineering-team-playbook | ✅ Linked                 |
| technical-hiring-framework      | ✅ Linked                 |
| technical-debt-strategy         | ✅ Linked + Cross-cluster |
| incident-response-saas          | 📝 Draft (publish May 19) |
| code-review-practices-scale     | 📝 Draft (publish Jul 28) |
| documentation-engineers-read    | 📝 Draft (publish Aug 25) |
| hiring-first-staff-engineer     | 📝 Draft (publish Sep 8)  |

### Frontend Architecture (9 published + 2 drafted)

| Post                                 | Status                    |
| ------------------------------------ | ------------------------- |
| neo-brutalism-developer-guide        | ✅ Linked                 |
| design-tokens-comprehensive          | ✅ Linked                 |
| accessibility-design-systems         | ✅ Linked                 |
| component-api-design                 | ✅ Linked                 |
| designer-developer-handoff           | ✅ Linked                 |
| tailwind-vs-component-libraries      | ✅ Linked                 |
| optimistic-ui                        | ✅ Linked                 |
| atmospheric-animations-framer-motion | ✅ Linked                 |
| typescript-business-case             | ✅ Linked + Cross-cluster |
| testing-react-server-components      | 📝 Draft (publish Jul 1)  |
| state-management-2026                | 📝 Draft (publish Aug 11) |

### Performance Engineering (5 published + 5 drafted)

| Post                             | Status                    |
| -------------------------------- | ------------------------- |
| core-web-vitals-optimization     | ✅ Linked                 |
| cdn-caching-strategy             | ✅ Linked                 |
| rsc-edge-death-of-waterfall      | ✅ Linked + Cross-cluster |
| nodejs-memory-leaks              | ✅ Linked                 |
| lambda-tax-cold-starts           | ✅ Linked                 |
| database-migration-patterns      | 📝 Draft (publish Mar 2)  |
| core-web-vitals-2026-audit       | 📝 Draft (publish Apr 1)  |
| edge-computing-saas              | 📝 Draft (publish May 5)  |
| caching-strategies-production    | 📝 Draft (publish Jun 2)  |
| real-time-performance-monitoring | 📝 Draft (publish Jul 14) |

### AI Development (6 published + 3 drafted)

| Post                                    | Status                    |
| --------------------------------------- | ------------------------- |
| ai-assisted-development-generative-debt | ✅ Linked                 |
| ai-code-review                          | ✅ Linked                 |
| llm-integration-architecture            | ✅ Linked                 |
| prompt-engineering-developers           | ✅ Linked                 |
| building-ai-features-users-want         | ✅ Linked                 |
| ai-cost-optimization                    | ✅ Linked                 |
| rag-architecture-saas                   | 📝 Draft (publish Mar 16) |
| vector-database-selection               | 📝 Draft (publish Apr 14) |
| llm-cost-optimization-scale             | 📝 Draft (publish Jun 16) |

---

## Internal Linking Structure

### Spoke → Hub Links

Every spoke post contains:

1. **"Part of [Hub]" callout** - Links to parent hub with brief description
2. **"More in This Series" section** - Lists 3-5 related spokes
3. **series frontmatter** - Identifies cluster membership

### Cross-Cluster Links

Meta-framework posts that span multiple topics include "Related Guides" section:

| Post                          | Links To                                 |
| ----------------------------- | ---------------------------------------- |
| tech-stack-capital-allocation | Engineering Leadership, Performance      |
| build-vs-buy                  | Engineering Leadership                   |
| boring-technology-wins        | Engineering Leadership, Performance      |
| rsc-edge-death-of-waterfall   | Frontend Architecture, SaaS Architecture |
| technical-debt-strategy       | SaaS Architecture                        |
| senior-developer-paradox      | AI Development                           |

### Service Page → Hub Links

All 20 pSEO service pages include relevant hub pages in `relatedBlogPosts`:

- SaaS services → `saas-architecture-decision-framework`
- React/Next.js services → `modern-frontend-architecture`
- Technical advisor services → `engineering-leadership-founder-to-cto`
- Performance services → `performance-engineering-playbook`
- AI services → `ai-assisted-development-guide`

---

## Blog Page Features

### Comprehensive Guides Section

- **Location:** Above category filters on /blog
- **Layout:** Responsive grid (5 cols on xl, 3 on lg, 2 on sm, 1 on mobile)
- **Display:** Featured image, title, description (2 lines)
- **Hover:** Image zoom, title color change to accent

### Category Filtering

- All Posts (44)
- Architecture (X)
- Business (X)
- Frontend (X)
- Infrastructure (X)

Hub posts are **excluded** from the main post feed to avoid duplication.

---

## Featured Images

All hub posts have branded featured images:

| Hub                                  | Image | Size       |
| ------------------------------------ | ----- | ---------- |
| AI-Assisted Development Guide        | ✅    | 196KB      |
| Modern Frontend Architecture         | ✅    | 138KB      |
| SaaS Architecture Decision Framework | ✅    | 165KB      |
| Performance Engineering Playbook     | ✅    | (existing) |
| Engineering Leadership               | ✅    | (existing) |

**Image Specs:**

- Dimensions: 1920x1072 (16:9)
- Format: WebP
- Style: Neo-brutalist, void navy background, cyber lime accents
- Title text included in image

---

## Schema Configuration

### source.config.ts

```typescript
// Blog schema includes hub/series fields
isHub: z.boolean().default(false),
series: z.string().optional(),
```

### Frontmatter Example (Hub)

```yaml
---
title: "AI-Assisted Development Guide"
isHub: true
series: "ai-development"
image: "/images/blog/ai-assisted-development-guide-featured.webp"
---
```

### Frontmatter Example (Spoke)

```yaml
---
title: "AI Code Review: Catching What LLMs Miss"
series: "ai-development"
image: "/images/blog/ai-code-review-featured.webp"
---
```

---

## Maintenance Notes

### Adding New Spoke Posts

1. Create MDX file in `content/blog/`
2. Add `series: "[cluster-name]"` to frontmatter
3. Add "Part of [Hub]" callout at top
4. Add "More in This Series" section at bottom
5. Update hub page's spoke list if manually maintained

### Adding New Hub

1. Create MDX file with `isHub: true`
2. Create featured image following brand guidelines
3. Add to CONTENT_STATUS.md
4. Will automatically appear in "Comprehensive Guides" section

### Cross-Cluster Linking

For posts spanning multiple topics:

1. Add "Related Guides" section after "More in This Series"
2. Link to relevant hub pages from other clusters
3. Update service pages if applicable

---

## Related Documentation

- **CLAUDE.md** - Project overview and commands
- **VOICE_GUIDE.md** - Brand voice for content
- **IMPLEMENTATION_PLAN.md** - Original marketing plan
- **HUB_AND_SPOKE_CONTENT_STRATEGY.md** - Research and best practices

---

_This document is the source of truth for content status. Update when adding new content._
