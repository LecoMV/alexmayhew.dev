# Blog Launch Content Plan: The 18 Articles

> **Version:** 1.0 | **Last Updated:** 2026-01-15
>
> Selected based on: GEO/SEO strategy, dual-audience value, authority building, and brand voice alignment.

---

## Selection Criteria Applied

1. **Information Gain** — Content AI can't generate (specific metrics, trade-offs, opinions)
2. **Dual-Audience** — Value for both technical and non-technical decision-makers
3. **Authority Signal** — Demonstrates "Atmospheric Engineering" expertise
4. **Pillar Balance** — Coverage across all four content pillars
5. **Anti-AI Authenticity** — Topics requiring genuine experience and strong opinions

---

## Distribution by Pillar

| Pillar                        | Count | Articles           |
| ----------------------------- | ----- | ------------------ |
| **Architect** (System Design) | 5     | 01, 04, 09, 12, 24 |
| **Instrument** (Technical)    | 5     | 02, 06, 11, 17, 25 |
| **Artisan** (Design/UX)       | 4     | 03, 07, 14, 23     |
| **Business** (Strategy/ROI)   | 4     | 05, 08, 20, 28     |

---

## The 18 Articles

### HERO CONTENT (3 Flagship Pieces)

These are 3,000+ word definitive guides with diagrams, benchmarks, and original research.

---

#### Article 01: The Anatomy of a High-Precision SaaS

**Pillar:** Architect | **Effort:** High | **Authority:** Flagship

**GEO Target Queries:**

- "SaaS architecture Next.js 2026"
- "Postgres schema multi-tenancy"
- "Full-stack SaaS tech stack"

**Dual-Audience Approach:**

- **Executive Summary:** "From zero to 100k users: the architecture decisions that scale"
- **Technical Depth:** Schema design, edge deployment, type-safe APIs

**Key Sections:**

1. The Foundation: Infrastructure choices (AWS vs. Cloudflare vs. Vercel)
2. The Spine: PostgreSQL schema for multi-tenant SaaS
3. The Skin: "Atmospheric" frontend with Core Web Vitals discipline
4. The Nervous System: Type-safety from DB to UI with Prisma + tRPC

**Anti-AI Authenticity:**

- Specific cost comparisons from real projects
- "Why I chose X over Y" with actual trade-offs
- Performance metrics from production systems

**Word Count:** 3,500+

---

#### Article 02: Migrating to the Edge: Latency Analysis

**Pillar:** Instrument | **Effort:** High | **Authority:** Data-Driven

**GEO Target Queries:**

- "Next.js Cloudflare vs Vercel performance"
- "Edge runtime cold start times 2026"
- "Next.js deployment benchmarks"

**Dual-Audience Approach:**

- **Executive Summary:** "40ms latency reduction = 8% conversion increase. Here's the data."
- **Technical Depth:** Cold start analysis, regional performance, cost modeling

**Key Sections:**

1. The Benchmark Setup: Methodology and testing environment
2. Cold Start Analysis: Real numbers, not marketing claims
3. Regional Performance: US, EU, APAC latency comparison
4. Cost Modeling: When edge makes sense (and when it doesn't)

**Anti-AI Authenticity:**

- Original benchmark data from actual deployments
- Spreadsheet-level cost analysis
- Honest "edge isn't always better" conclusions

**Word Count:** 3,000+

---

#### Article 03: The 'Atmospheric' Stack: Rejecting UI Libraries

**Pillar:** Artisan | **Effort:** Medium | **Authority:** Brand-Defining

**GEO Target Queries:**

- "Tailwind vs Material UI 2026"
- "Custom design system startup"
- "Neo-brutalist web design"

**Dual-Audience Approach:**

- **Executive Summary:** "Generic UI kits create generic products. Here's the alternative."
- **Technical Depth:** CSS architecture, Tailwind patterns, animation physics

**Key Sections:**

1. The Problem with UI Libraries: Technical debt disguised as productivity
2. The "Atmospheric" Philosophy: Precision over convenience
3. Building Blocks: Component patterns without component libraries
4. Results: Conversion improvements from design differentiation

**Anti-AI Authenticity:**

- Portfolio examples with before/after
- Strong opinion on when to break rules
- Neo-Brutalist manifesto elements

**Word Count:** 2,500+

---

### ARCHITECT PILLAR (2 Additional)

---

#### Article 04: Postgres vs. MongoDB for Fintech

**Pillar:** Architect | **Effort:** Medium | **Authority:** Advisory

**GEO Target Queries:**

- "SQL vs NoSQL fintech 2026"
- "Database choice financial application"
- "Postgres fintech compliance"

**Dual-Audience Approach:**

- **Executive Summary:** "For regulated industries, the database choice isn't about features—it's about audits."
- **Technical Depth:** ACID compliance, audit trails, regulatory requirements

**Key Sections:**

1. The Compliance Lens: What regulators actually require
2. Audit Trails: Why schema-on-read is a liability
3. The Performance Myth: When MongoDB isn't actually faster
4. Decision Framework: 5 questions to answer before choosing

**Word Count:** 2,000

---

#### Article 09: Multi-Tenancy with Prisma & Row Level Security

**Pillar:** Architect | **Effort:** High | **Authority:** Technical

**GEO Target Queries:**

- "Prisma multi-tenancy"
- "PostgreSQL RLS tutorial"
- "SaaS data isolation"

**Dual-Audience Approach:**

- **Executive Summary:** "One database breach can end a SaaS company. RLS prevents it by design."
- **Technical Depth:** Schema design, RLS policies, Prisma middleware

**Key Sections:**

1. The Risk: What happens when tenant isolation fails
2. Schema Design: Shared vs. siloed approaches
3. RLS Policies: Implementation with code samples
4. Testing Isolation: How to verify it actually works

**Word Count:** 2,500

---

#### Article 12: Bulletproof CI/CD for Next.js

**Pillar:** Architect | **Effort:** Medium | **Authority:** DevOps

**GEO Target Queries:**

- "Next.js CI/CD GitHub Actions"
- "Docker Next.js deployment"
- "Preview deployments setup"

**Dual-Audience Approach:**

- **Executive Summary:** "A broken deploy process costs more than the feature it blocks."
- **Technical Depth:** GitHub Actions, Docker builds, preview environments

**Key Sections:**

1. The Pipeline Architecture: From commit to production
2. Preview Environments: PR-based deployment
3. Rollback Strategy: When things go wrong
4. Cost Optimization: Caching and parallelization

**Word Count:** 1,800

---

#### Article 24: Secure Authentication for B2B SaaS

**Pillar:** Architect | **Effort:** Medium | **Authority:** Security

**GEO Target Queries:**

- "NextAuth enterprise"
- "B2B authentication patterns"
- "SSO implementation Next.js"

**Dual-Audience Approach:**

- **Executive Summary:** "Enterprise deals require enterprise auth. Here's the implementation."
- **Technical Depth:** SSO, RBAC, session management, audit logging

**Key Sections:**

1. Enterprise Requirements: What large customers demand
2. SSO Implementation: SAML, OIDC, and the pain points
3. Role-Based Access: Flexible permission systems
4. Audit Logging: Making compliance happy

**Word Count:** 2,200

---

### INSTRUMENT PILLAR (4 Additional)

---

#### Article 06: Optimizing AWS Lambda Cold Starts

**Pillar:** Instrument | **Effort:** Low | **Authority:** Problem-Solving

**GEO Target Queries:**

- "Lambda cold start optimization"
- "Serverless performance 2026"
- "AWS Lambda provisioned concurrency"

**Dual-Audience Approach:**

- **Executive Summary:** "We cut cold starts from 3.2s to 180ms. Here's the exact playbook."
- **Technical Depth:** Bundle size, provisioned concurrency, architecture patterns

**Key Sections:**

1. Measuring the Problem: Identifying cold start impact
2. Quick Wins: Bundle optimization, dependency pruning
3. Architecture Patterns: Keep-warm strategies that work
4. When to Leave Lambda: Signs serverless isn't the answer

**Word Count:** 1,500

---

#### Article 11: 3 Advanced React Server Component Patterns

**Pillar:** Instrument | **Effort:** Medium | **Authority:** Technical

**GEO Target Queries:**

- "React Server Components patterns"
- "RSC best practices 2026"
- "Next.js App Router advanced"

**Dual-Audience Approach:**

- **Executive Summary:** "RSC shipped. Now here's how to actually use them well."
- **Technical Depth:** Composition patterns, data fetching, streaming

**Key Sections:**

1. Pattern 1: Parallel Data Fetching with Suspense Boundaries
2. Pattern 2: Client Islands in Server Seas
3. Pattern 3: Streaming with Progressive Enhancement
4. When NOT to Use RSC: The trade-offs nobody talks about

**Word Count:** 2,000

---

#### Article 17: The 'No-Loading-State' UI

**Pillar:** Instrument | **Effort:** Low | **Authority:** UX/Technical

**GEO Target Queries:**

- "React Query optimistic updates"
- "Optimistic UI patterns"
- "No loading spinners"

**Dual-Audience Approach:**

- **Executive Summary:** "Loading spinners are a failure of imagination. Here's the alternative."
- **Technical Depth:** Optimistic updates, mutation strategies, rollback handling

**Key Sections:**

1. The Psychology: Why loading states hurt conversion
2. Optimistic Updates: Implementation with React Query
3. Error Recovery: What happens when optimism fails
4. When to Wait: Cases where loading states are correct

**Word Count:** 1,500

---

#### Article 25: Debugging Memory Leaks in Node.js

**Pillar:** Instrument | **Effort:** Medium | **Authority:** Troubleshooting

**GEO Target Queries:**

- "Node.js memory leak debugging"
- "V8 heap analysis"
- "Node.js performance profiling"

**Dual-Audience Approach:**

- **Executive Summary:** "Your server restarts every 4 hours. Here's why—and how to fix it."
- **Technical Depth:** Heap snapshots, profiling tools, common culprits

**Key Sections:**

1. Identifying the Leak: Symptoms and metrics
2. Heap Snapshot Analysis: Chrome DevTools for Node
3. Common Culprits: Closures, event listeners, caching gone wrong
4. Prevention Patterns: Writing leak-resistant code

**Word Count:** 1,800

---

### ARTISAN PILLAR (3 Additional)

---

#### Article 07: Neo-Brutalism: A Developer's Guide

**Pillar:** Artisan | **Effort:** Medium | **Authority:** Visual/Brand

**GEO Target Queries:**

- "Neo-brutalist web design"
- "Brutalist UI examples"
- "Anti-design trend 2026"

**Dual-Audience Approach:**

- **Executive Summary:** "In a world of rounded corners, sharp edges stand out."
- **Technical Depth:** CSS techniques, typography, color theory

**Key Sections:**

1. The Philosophy: Truth to materials in digital form
2. Visual Elements: High contrast, raw grids, functional typography
3. Implementation: CSS patterns for brutalist UI
4. When Brutalism Fails: Knowing the limits

**Word Count:** 1,800

---

#### Article 14: From Figma to Code: Pixel-Perfect Implementation

**Pillar:** Artisan | **Effort:** Medium | **Authority:** Process

**GEO Target Queries:**

- "Figma to React workflow"
- "Pixel perfect CSS"
- "Design handoff best practices"

**Dual-Audience Approach:**

- **Executive Summary:** "Designers hate your implementation. Here's how to fix that relationship."
- **Technical Depth:** Measurement techniques, component mapping, handoff tools

**Key Sections:**

1. The Gap: Why implementations drift from designs
2. Measurement Workflow: Tools and techniques
3. Component Mapping: From Figma to React
4. The Feedback Loop: Catching drift early

**Word Count:** 1,600

---

#### Article 23: Atmospheric Animations: Physics in Framer Motion

**Pillar:** Artisan | **Effort:** Medium | **Authority:** Visual/Technical

**GEO Target Queries:**

- "Framer Motion spring physics"
- "React animation best practices"
- "Physics-based UI animation"

**Dual-Audience Approach:**

- **Executive Summary:** "Linear animations feel robotic. Spring physics feel alive."
- **Technical Depth:** Spring configuration, gesture integration, performance

**Key Sections:**

1. The Case for Physics: Why spring > linear
2. Spring Configuration: Stiffness, damping, mass
3. Gesture Integration: Drag, tap, and scroll
4. Performance: Keeping 60fps with complex animations

**Word Count:** 1,800

---

### BUSINESS PILLAR (4 Articles)

---

#### Article 05: Why 'Generic' AI Code Creates Technical Debt

**Pillar:** Business | **Effort:** Low | **Authority:** Contrarian

**GEO Target Queries:**

- "AI code quality risks"
- "GitHub Copilot technical debt"
- "AI generated code problems"

**Dual-Audience Approach:**

- **Executive Summary:** "AI writes code faster. It also writes debt faster."
- **Technical Depth:** Pattern analysis, refactoring costs, review requirements

**Key Sections:**

1. The Productivity Illusion: Speed vs. maintainability
2. The Patterns: What AI code looks like 6 months later
3. The Cost: Refactoring AI-generated systems
4. The Balance: When AI assistance works

**Word Count:** 1,400

---

#### Article 08: The Hidden Cost of 'Cheap' Developers

**Pillar:** Business | **Effort:** Low | **Authority:** Sales/Advisory

**GEO Target Queries:**

- "Freelance developer rates ROI"
- "Cheap developers technical debt"
- "Software development cost comparison"

**Dual-Audience Approach:**

- **Executive Summary:** "$150/hr saves money. Here's the math."
- **Technical Depth:** TCO analysis, refactoring costs, timeline impacts

**Key Sections:**

1. The Rate Illusion: Why $50/hr costs more than $150/hr
2. The Math: Real project cost comparisons
3. The Signals: How to spot quality before hiring
4. The Investment: What premium rates actually buy

**Word Count:** 1,400

---

#### Article 20: The CTO's Guide to Choosing a Tech Stack

**Pillar:** Business | **Effort:** Low | **Authority:** Executive

**GEO Target Queries:**

- "Tech stack selection 2026"
- "Startup technology choices"
- "CTO technology strategy"

**Dual-Audience Approach:**

- **Executive Summary:** "Your tech stack is a business decision, not a technical one."
- **Technical Depth:** Decision frameworks, hiring implications, migration costs

**Key Sections:**

1. The Real Criteria: Hiring, maintenance, and time-to-market
2. The Boring Stack: Why proven > exciting
3. Decision Framework: 7 questions before choosing
4. The Escape Hatch: Planning for the pivot

**Word Count:** 1,500

---

#### Article 28: Why TypeScript is Your Best Documentation

**Pillar:** Business | **Effort:** Low | **Authority:** Opinion

**GEO Target Queries:**

- "TypeScript ROI"
- "TypeScript documentation benefits"
- "Static typing business case"

**Dual-Audience Approach:**

- **Executive Summary:** "TypeScript doesn't slow you down. It saves the next developer 40 hours."
- **Technical Depth:** IDE benefits, onboarding time, bug prevention

**Key Sections:**

1. The Documentation Problem: Why comments lie
2. Types as Truth: Self-documenting interfaces
3. The Onboarding Effect: New developer productivity
4. The Counter-Argument: When types aren't worth it

**Word Count:** 1,200

---

## Content Production Order

### Phase 1: Foundation (3 Hero Articles)

Establishes authority and creates pillar anchor content.

1. **Article 03** — The 'Atmospheric' Stack (Brand definition)
2. **Article 01** — Anatomy of a High-Precision SaaS (Technical flagship)
3. **Article 02** — Migrating to the Edge (Data authority)

### Phase 2: Quick Wins (8 Articles)

Build momentum with shorter, opinionated pieces.

4. **Article 05** — AI Code Technical Debt (Contrarian, viral potential)
5. **Article 08** — Hidden Cost of Cheap Developers (Sales enablement)
6. **Article 07** — Neo-Brutalism Guide (Brand reinforcement)
7. **Article 17** — No-Loading-State UI (Practical, shareable)
8. **Article 06** — Lambda Cold Starts (Problem-solving)
9. **Article 28** — TypeScript as Documentation (Quick opinion piece)
10. **Article 20** — CTO's Tech Stack Guide (Executive audience)
11. **Article 14** — Figma to Code (Process credibility)

### Phase 3: Technical Depth (7 Articles)

Cement technical authority with deeper content.

12. **Article 11** — RSC Patterns (Technical credibility)
13. **Article 09** — Multi-Tenancy with RLS (Security authority)
14. **Article 23** — Framer Motion Physics (Visual expertise)
15. **Article 04** — Postgres vs MongoDB (Advisory credibility)
16. **Article 24** — B2B Authentication (Enterprise readiness)
17. **Article 12** — CI/CD Pipeline (DevOps competence)
18. **Article 25** — Memory Leak Debugging (Troubleshooting depth)

---

## Word Count Summary

| Type      | Count  | Average Words | Total Words |
| --------- | ------ | ------------- | ----------- |
| Hero      | 3      | 3,000         | 9,000       |
| Standard  | 15     | 1,700         | 25,500      |
| **Total** | **18** | —             | **~34,500** |

---

## Next Steps

1. **Create beads** for each article as individual tasks
2. **Write Article 03** first (brand definition piece)
3. **Establish review process** against brand voice guidelines
4. **Set up CMS structure** for progressive disclosure formatting

---

_This content plan is designed to launch alexmayhew.dev as a GEO-optimized authority in full-stack development, targeting high-ticket clients through demonstrable expertise._
