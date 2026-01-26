# alexmayhew.dev - Complete Marketing & SEO Implementation Plan

> **Generated:** 2026-01-26
> **Last Updated:** 2026-01-26 (Pre-clear baseline checkpoint)
> **Status:** PHASE 0 COMPLETE - 21 pSEO pages live, expanding verticals
> **Epic:** amdev-183 (2026 Marketing Launch Plan)

---

## Executive Summary

This plan consolidates findings from:

- Gemini Research Document (pSEO + Agentic Optimization)
- MARKETING_PLAN_2026.md (5-phase go-to-market strategy)
- Current site audit (gaps and existing infrastructure)

**Goal:** Transform alexmayhew.dev into a lead generation engine that ranks for high-intent B2B queries and is discoverable by AI agents.

---

## Current State Assessment (Updated 2026-01-26)

### ✅ Phase 0 COMPLETE

| Component                   | Status      | Notes                             |
| --------------------------- | ----------- | --------------------------------- |
| `/services/[slug]/page.tsx` | ✅ Complete | Dynamic route with full template  |
| `/services/page.tsx`        | ✅ Complete | Hub page with filtering           |
| `public/llms.txt`           | ✅ Complete | AI agent discovery file           |
| `sitemap.ts`                | ✅ Complete | Includes all 21 service pages     |
| JSON-LD Schema              | ✅ Complete | Service, FAQ, WebPage, Breadcrumb |
| pSEO Pages                  | ✅ 21 pages | Exceeded 20-page target           |

### ✅ What's Working

| Component       | Status      | Notes                                                      |
| --------------- | ----------- | ---------------------------------------------------------- |
| JSON-LD Schema  | Complete    | Person, WebSite, ProfessionalService, Service, FAQ schemas |
| robots.txt      | Complete    | Proper allow/disallow configuration                        |
| sitemap.ts      | Complete    | Auto-includes all pSEO pages                               |
| pSEO Data Layer | Complete    | 21 pages, 8 technologies, 10 industries                    |
| Blog Content    | 19 posts    | All referenced posts exist                                 |
| Portfolio       | 10 projects | Strong proof points                                        |
| Design System   | Complete    | Neo-brutalist aesthetic, Tailwind, Framer Motion           |
| TraceForge      | Complete    | GPU vectorizer tool live                                   |

### 🚧 Next Priority (P1 Beads)

| Gap                       | Bead                            | Impact                                      |
| ------------------------- | ------------------------------- | ------------------------------------------- |
| Legacy Migration Vertical | amdev-cqy, amdev-nga, amdev-f7t | High commercial intent ($500K+ engagements) |
| SaaS Integration Vertical | amdev-3nt, amdev-65k, amdev-249 | API architecture expertise                  |
| Technology Hub Pages      | amdev-79j                       | Capture 3,180+ monthly base searches        |
| Role-based Founder Pages  | amdev-6qf                       | Ideal customer profile targeting            |
| Analytics (GA4/Sentry)    | amdev-kgm, amdev-71k, amdev-baz | Can't measure anything                      |

### 📋 P2 Enhancements

| Gap                      | Bead      | Impact                     |
| ------------------------ | --------- | -------------------------- |
| HowTo JSON-LD schema     | amdev-85q | Process query capture      |
| LocalBusiness schema     | amdev-69n | Boston geo-targeting       |
| Comparison pages         | amdev-a5c | Decision-stage searches    |
| Expert approach content  | amdev-75e | E-E-A-T differentiation    |
| Meta tag optimization    | amdev-3zu | CTR improvement            |
| Topic cluster navigation | amdev-j2t | Internal linking structure |

---

## Implementation Phases

### Phase 0: Critical Infrastructure (IMMEDIATE - 2 hours)

**Blocker:** Nothing works until the pSEO route renders.

#### Task 0.1: Create Services Route Handler

**File:** `src/app/services/[slug]/page.tsx`

```typescript
// Required functionality:
// - generateStaticParams() → all published page slugs
// - generateMetadata() → SEO meta from page data
// - ServiceJsonLd component for structured data
// - Full page template matching design system
// - Internal links to related services
```

**Acceptance Criteria:**

- [ ] `/services/nextjs-developer-for-saas` renders correctly
- [ ] All 5 existing pages accessible
- [ ] JSON-LD ServicePage schema on each page
- [ ] Metadata unique per page (title, description)

#### Task 0.2: Create Services Index Page

**File:** `src/app/services/page.tsx`

Acts as the "hub" page linking to all service pages. Required for:

- Internal linking hub
- Pillar page for SEO authority
- Discovery for users

#### Task 0.3: Update Sitemap

**File:** `src/app/sitemap.ts`

Add all `/services/*` slugs to sitemap with:

- Priority: 0.9
- changeFrequency: 'monthly'

---

### Phase 1: Agentic Optimization (Day 1-2)

#### Task 1.1: Create llms.txt

**File:** `public/llms.txt`

Content (from Gemini research):

```
# Alex Mayhew: Technical Advisor & Systems Architect

"Atmospheric Engineering" is high-precision, low-latency architecture for modern web development.

## Core Capabilities
- System Architecture (sys.architect): Scalable microservices, cloud-native infrastructure on AWS/GCP/Cloudflare
- Performance Engineering (perf.optimize): Sub-50ms INP, Core Web Vitals optimization, Next.js edge computing
- Legacy Migration: Strategic refactoring from monoliths (ColdFusion, AngularJS) to modern stacks (Next.js, Node.js)
- AI/ML Integration: LLM deployment, RAG systems, vector databases, fine-tuning pipelines

## Technical Stack
- Frontend: Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion
- Backend: Node.js, Python/FastAPI, PostgreSQL, Redis
- Infrastructure: Cloudflare Pages/Workers, AWS, Docker, Kubernetes
- AI/ML: PyTorch, Transformers, Qdrant, OpenAI/Anthropic APIs

## Proof of Work
- TraceForge: GPU-accelerated vectorization (337x faster than Inkscape)
- PhotoKeep Pro: AI photo restoration (28.5dB PSNR, 73% cost reduction)
- PenQWEN: Domain-adapted cybersecurity LLM
- Claude Pilot: Enterprise Claude Code manager

## Services
- /services/nextjs-developer-for-saas
- /services/react-developer-for-fintech
- /services/fullstack-developer-for-startups
- /services/technical-advisor-for-startups

## Contact
alex@alexmayhew.dev
https://alexmayhew.dev/contact
```

#### Task 1.2: Enhanced JSON-LD Schema

**File:** `src/components/seo/json-ld.tsx`

Updates needed:

- Change `jobTitle` from "Full-Stack Developer" → "Technical Advisor & Systems Architect"
- Change `worksFor.name` from "Freelance" → "Alex Mayhew Consulting"
- Expand `knowsAbout` array with specific technologies from Gemini research
- Add `hasCredential` for any certifications
- Add `award` for notable achievements

#### Task 1.3: Service Page JSON-LD

**File:** `src/components/seo/service-json-ld.tsx`

Create industry-specific structured data for each pSEO page:

- ServicePage schema
- FAQPage schema (from page FAQs)
- HowTo schema (from projectApproach)
- Offer schema with budget ranges

---

### Phase 2: Content Generation (Days 2-5)

#### Task 2.1: Generate 15 Additional pSEO Pages

**File:** `src/data/pseo/pages.ts`

Target slugs (from marketing plan + Gemini research):

**Technology + Industry Combinations:**

1. `nextjs-developer-for-fintech`
2. `nextjs-developer-for-healthcare`
3. `nextjs-developer-for-ecommerce`
4. `react-developer-for-saas`
5. `react-developer-for-healthcare`
6. `nodejs-developer-for-logistics`
7. `python-developer-for-fintech`
8. `python-developer-for-saas`
9. `postgresql-expert-for-fintech`
10. `ai-integration-developer-for-saas`
11. `ai-integration-developer-for-healthcare`

**Advisory Positions:** 12. `fractional-cto-for-seed-stage` 13. `technical-due-diligence-consultant` 14. `legacy-migration-architect` 15. `performance-optimization-consultant`

**Quality Requirements (per page):**

- [ ] 5+ unique insights (50+ chars each)
- [ ] 150+ words in whyThisStack
- [ ] 150+ words in projectApproach
- [ ] 3+ industry regulations (if applicable)
- [ ] 5+ pain points with solutions
- [ ] 5+ tech recommendations
- [ ] 4+ FAQs
- [ ] Budget guidance with factors
- [ ] SEO title 30-70 chars
- [ ] SEO description 100-170 chars

#### Task 2.2: Legacy Migration Vertical (Gemini Vertical A)

**New Data File:** `src/data/pseo/migrations.ts`

Create data for legacy → modern migration pages:

| Legacy Tech       | Modern Tech   | Slug                                |
| ----------------- | ------------- | ----------------------------------- |
| AngularJS         | React/Next.js | `angularjs-to-nextjs-migration`     |
| ColdFusion        | Node.js       | `coldfusion-to-nodejs-migration`    |
| ASP.NET Web Forms | .NET Core     | `aspnet-webforms-to-core-migration` |
| jQuery            | React         | `jquery-to-react-migration`         |
| Drupal 7          | Headless CMS  | `drupal7-to-headless-migration`     |

**Data Points per Migration:**

- EOL date of legacy tech
- CVE count / security risk score
- Estimated performance improvement
- Talent availability delta
- Migration pattern (Strangler Fig, Big Bang, etc.)
- Timeline estimate
- Budget range

#### Task 2.3: SaaS Integration Vertical (Gemini Vertical B)

**New Data File:** `src/data/pseo/integrations.ts`

Target integrations:

| SaaS A     | SaaS B  | Industry   | Slug                                    |
| ---------- | ------- | ---------- | --------------------------------------- |
| Salesforce | Stripe  | Fintech    | `salesforce-stripe-integration-fintech` |
| NetSuite   | Shopify | E-commerce | `netsuite-shopify-integration`          |
| HubSpot    | Slack   | SaaS       | `hubspot-slack-integration-saas`        |

---

### Phase 3: Analytics & Monitoring (Day 3)

#### Task 3.1: Initialize Sentry

**File:** `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`

```typescript
// Required configuration:
Sentry.init({
	dsn: process.env.SENTRY_DSN,
	tracesSampleRate: 0.1,
	replaysSessionSampleRate: 0.1,
	replaysOnErrorSampleRate: 1.0,
});
```

#### Task 3.2: Add Web Vitals Monitoring

**File:** `src/app/layout.tsx` or instrumentation hook

Track:

- LCP (Largest Contentful Paint)
- INP (Interaction to Next Paint)
- CLS (Cumulative Layout Shift)

Send to Sentry Performance or custom endpoint.

#### Task 3.3: Add Google Analytics 4

**File:** `src/components/analytics/google-analytics.tsx`

Setup:

- Page view tracking
- Contact form submission events
- Blog read events
- Services page view events

#### Task 3.4: Google Search Console Setup

- Verify domain ownership
- Submit sitemap.xml
- Request indexing of key pages
- Monitor coverage issues

---

### Phase 4: Messaging Overhaul (Day 4-5)

Maps to MARKETING_PLAN Phase 1.

#### Task 4.1: Homepage Rewrite

**File:** `src/app/page.tsx`

Changes:

- Hero: "Strategic Architecture" → stronger "Technical Advisor" positioning
- Remove any "freelancer" language
- Add social proof (metrics, client logos if permitted)
- Update CTAs: "Initialize Project" → "Schedule Consultation"

#### Task 4.2: About Page Rewrite

**File:** `src/components/pages/about-page.tsx`

Structure (from marketing plan):

1. Problem statement (what CTOs face)
2. Proof points with metrics
3. Approach/philosophy
4. Technical toolkit
5. Journey timeline
6. CTA

#### Task 4.3: Services Framework Creation

Define three tiers (from marketing plan):

**Tier 1: Advisory Retainer**

- Monthly strategic guidance
- Architecture reviews
- Technical decision support

**Tier 2: Strategic Implementation**

- MVP to enterprise builds
- Performance optimization
- Legacy modernization

**Tier 3: Technical Due Diligence**

- For VCs/PE firms
- M&A technical assessment
- Risk evaluation

---

### Phase 5: Internal Linking (Day 5-6)

Maps to bead `amdev-a8h`.

#### Task 5.1: Hub-Spoke Architecture

- `/services` page links to all pSEO pages
- Each pSEO page links back to hub
- Related services cross-linked

#### Task 5.2: Contextual Links

Auto-link mentions in blog posts to:

- Service pages when mentioning technologies
- About page when mentioning expertise
- Contact when mentioning consultation

#### Task 5.3: Breadcrumb Navigation

Add breadcrumbs to service pages:
`Home > Services > [Technology] Developer for [Industry]`

---

### Phase 6: Content Refresh (Ongoing)

#### Task 6.1: Case Study Enhancement

Transform portfolio projects into evidence-based case studies:

- The Constraint (problem)
- The Instrument (solution architecture)
- The Precision (metrics/outcomes)
- The Artifact (code snippet or diagram)

#### Task 6.2: Blog Post Optimization

For each of 19 existing posts:

- Add internal links to services
- Update meta descriptions
- Add FAQ schema where applicable
- Ensure all have proper featured images

---

## Content Requirements Summary

### pSEO Pages Needed: 20 total

| #   | Slug                                    | Technology | Industry   | Status    |
| --- | --------------------------------------- | ---------- | ---------- | --------- |
| 1   | nextjs-developer-for-saas               | nextjs     | saas       | ✅ EXISTS |
| 2   | react-developer-for-fintech             | react      | fintech    | ✅ EXISTS |
| 3   | python-developer-for-healthcare         | nodejs     | healthcare | ✅ EXISTS |
| 4   | fullstack-developer-for-startups        | typescript | saas       | ✅ EXISTS |
| 5   | technical-advisor-for-startups          | typescript | saas       | ✅ EXISTS |
| 6   | nextjs-developer-for-fintech            | nextjs     | fintech    | ❌ CREATE |
| 7   | nextjs-developer-for-healthcare         | nextjs     | healthcare | ❌ CREATE |
| 8   | nextjs-developer-for-ecommerce          | nextjs     | ecommerce  | ❌ CREATE |
| 9   | react-developer-for-saas                | react      | saas       | ❌ CREATE |
| 10  | react-developer-for-healthcare          | react      | healthcare | ❌ CREATE |
| 11  | nodejs-developer-for-logistics          | nodejs     | logistics  | ❌ CREATE |
| 12  | python-developer-for-fintech            | python     | fintech    | ❌ CREATE |
| 13  | python-developer-for-saas               | python     | saas       | ❌ CREATE |
| 14  | postgresql-expert-for-fintech           | postgresql | fintech    | ❌ CREATE |
| 15  | ai-integration-developer-for-saas       | ai-ml      | saas       | ❌ CREATE |
| 16  | ai-integration-developer-for-healthcare | ai-ml      | healthcare | ❌ CREATE |
| 17  | fractional-cto-for-seed-stage           | typescript | saas       | ❌ CREATE |
| 18  | technical-due-diligence-consultant      | typescript | saas       | ❌ CREATE |
| 19  | legacy-migration-architect              | nodejs     | saas       | ❌ CREATE |
| 20  | performance-optimization-consultant     | nextjs     | saas       | ❌ CREATE |

### Migration Pages (Phase 2 - Gemini Vertical A): 5 pages

### Integration Pages (Phase 2 - Gemini Vertical B): 3 pages

---

## Dependencies Graph

```
Phase 0 (Route) ─────────────────────┐
         │                           │
         ▼                           │
Phase 1 (Agentic) ──► Phase 5 (Linking)
         │                           │
         ▼                           │
Phase 2 (Content) ───────────────────┤
         │                           │
         ▼                           │
Phase 3 (Analytics) ─────────────────┤
         │                           │
         ▼                           │
Phase 4 (Messaging) ─────────────────┘
         │
         ▼
     GSC Submit (amdev-8n0)
```

---

## Risk Assessment

| Risk                            | Probability | Impact | Mitigation                                       |
| ------------------------------- | ----------- | ------ | ------------------------------------------------ |
| pSEO pages flagged as duplicate | Medium      | High   | Quality gates ensure 5+ unique insights per page |
| INP regression from animations  | Medium      | Medium | Test CWV after each phase                        |
| Low conversion from traffic     | High        | Medium | A/B test CTAs, track funnel                      |
| LLM hallucination in content    | Low         | High   | Manual review all generated content              |

---

## Success Metrics

### 30-Day Targets

- [ ] 20 pSEO pages live and indexed
- [ ] llms.txt deployed and verified
- [ ] GA4 + Sentry tracking active
- [ ] Homepage messaging updated

### 60-Day Targets

- [ ] First organic lead from pSEO page
- [ ] INP < 100ms on all pages
- [ ] All migration pages live (Vertical A)

### 90-Day Targets

- [ ] 3-5 qualified leads/month from organic
- [ ] Top 10 ranking for 5+ long-tail keywords
- [ ] Integration pages live (Vertical B)

---

## Execution Order (Prioritized)

1. **NOW:** Create `src/app/services/[slug]/page.tsx`
2. **NOW:** Create `src/app/services/page.tsx` (hub)
3. **NOW:** Create `public/llms.txt`
4. **Day 1:** Update sitemap with service pages
5. **Day 1:** Test all 5 existing pages render correctly
6. **Day 2:** Generate 5 more pSEO pages
7. **Day 2:** Initialize Sentry + Web Vitals
8. **Day 3:** Generate 5 more pSEO pages
9. **Day 3:** Setup GA4
10. **Day 4:** Generate 5 more pSEO pages (20 total)
11. **Day 4:** Homepage messaging rewrite
12. **Day 5:** Internal linking strategy
13. **Day 5:** Submit to GSC
14. **Day 6:** Begin migration vertical (Gemini Vertical A)

---

## Files to Create/Modify

### Create New

- [ ] `src/app/services/[slug]/page.tsx`
- [ ] `src/app/services/page.tsx`
- [ ] `public/llms.txt`
- [ ] `sentry.client.config.ts`
- [ ] `sentry.server.config.ts`
- [ ] `sentry.edge.config.ts`
- [ ] `src/components/analytics/google-analytics.tsx`
- [ ] `src/data/pseo/migrations.ts` (Vertical A)
- [ ] `src/data/pseo/integrations.ts` (Vertical B)

### Modify Existing

- [ ] `src/app/sitemap.ts` (add service pages)
- [ ] `src/components/seo/json-ld.tsx` (advisor positioning)
- [ ] `src/components/seo/service-json-ld.tsx` (enhance)
- [ ] `src/data/pseo/pages.ts` (add 15 pages)
- [ ] `src/app/page.tsx` (messaging)
- [ ] `src/components/pages/about-page.tsx` (messaging)
- [ ] `src/app/layout.tsx` (analytics, web vitals)

---

## Beads to Close After Completion

- `amdev-fb7` - Route created (needs reopening - was closed prematurely)
- `amdev-rr0` - Generate 20 pSEO pages
- `amdev-a8h` - Internal linking strategy
- `amdev-8n0` - Submit to GSC
- `amdev-nfc` - Phase 1: Positioning & Messaging
- `amdev-9z1` - Phase 2: pSEO Implementation

---

## Appendix: Research Sources

1. `/home/deploy/projects/amdev/Gemini_Research_pSEO+Site-Enhancements.md`
2. `/home/deploy/projects/amdev/alexmayhew-dev/MARKETING_PLAN_2026.md`
3. `/home/deploy/projects/amdev/alexmayhew-dev/src/data/pseo/` (existing infrastructure)
4. `/home/deploy/projects/amdev/alexmayhew-dev/src/components/seo/` (existing schemas)
5. Beads issue tracker (`bd list`)
