# Editorial Calendar 2026 — alexmayhew.dev

> Master plan for blog posts, newsletters, and content themes.
> Cadence: 2 blog posts/month (spokes) + 4 newsletters/month (weekly)
> See `docs/CONTENT_OPERATIONS.md` for the full workflow.

---

## Annual Overview

| Quarter      | Blog Posts | Newsletters | Theme Focus                                      |
| ------------ | ---------- | ----------- | ------------------------------------------------ |
| Q1 (Jan-Mar) | 6          | 12          | SaaS Architecture + AI Development               |
| Q2 (Apr-Jun) | 6          | 13          | Performance Engineering + Engineering Leadership |
| Q3 (Jul-Sep) | 6          | 13          | Frontend Architecture + SaaS Patterns            |
| Q4 (Oct-Dec) | 6          | 13          | Year-in-review + Contrarian series               |
| **Total**    | **24**     | **51**      |                                                  |

---

## Q1 2026 (January – March)

### February

| Week       | Type          | Title                                  | Hub/Pillar        | Status    |
| ---------- | ------------- | -------------------------------------- | ----------------- | --------- |
| Feb 3 (A)  | Blog          | Boring Technology Wins (repurpose)     | SaaS Architecture | Scheduled |
| Feb 4      | Newsletter #1 | Why Your SaaS Needs a Monolith First   | architecture      | Draft     |
| Feb 10 (B) | Newsletter #2 | The Hidden Cost of Microservices       | architecture      | Draft     |
| Feb 17 (A) | Blog          | _New spoke — see Spoke Pipeline below_ | SaaS Architecture | Planned   |
| Feb 18     | Newsletter #3 | PostgreSQL RLS for Multi-Tenancy       | saas-patterns     | Draft     |
| Feb 24 (B) | Newsletter #4 | When NOT to Use Next.js                | contrarian        | Draft     |

### March

| Week       | Type          | Title                                           | Hub/Pillar        | Status  |
| ---------- | ------------- | ----------------------------------------------- | ----------------- | ------- |
| Mar 2 (A)  | Blog          | Database Migrations That Won't Wake You at 3 AM | SaaS Architecture | Planned |
| Mar 4      | Newsletter #5 | Database Migrations (feature blog)              | architecture      | Planned |
| Mar 10 (B) | Newsletter #6 | The Architecture Decision I Regret Most         | architecture      | Planned |
| Mar 16 (A) | Blog          | RAG Architecture for SaaS Products              | AI Development    | Planned |
| Mar 18     | Newsletter #7 | RAG Architecture (feature blog)                 | ai-development    | Planned |
| Mar 24 (B) | Newsletter #8 | How I Replaced $500/mo in API Costs             | performance       | Planned |

---

## Q2 2026 (April – June)

### April

| Week       | Type           | Title                                         | Hub/Pillar              | Status  |
| ---------- | -------------- | --------------------------------------------- | ----------------------- | ------- |
| Apr 1 (A)  | Blog           | Core Web Vitals Audit Checklist (2026 Update) | Performance Engineering | Planned |
| Apr 1      | Newsletter #9  | Core Web Vitals Audit (feature blog)          | performance             | Planned |
| Apr 8 (B)  | Newsletter #10 | The Real Cost of Technical Debt               | architecture            | Planned |
| Apr 14 (A) | Blog           | Vector Databases: When to Build vs Buy        | AI Development          | Planned |
| Apr 15     | Newsletter #11 | Vector Databases (feature blog)               | ai-development          | Planned |
| Apr 22 (B) | Newsletter #12 | Code Review That Actually Adds Value          | leadership              | Planned |

### May

| Week       | Type           | Title                                     | Hub/Pillar              | Status  |
| ---------- | -------------- | ----------------------------------------- | ----------------------- | ------- |
| May 5 (A)  | Blog           | Edge Computing: When Worth the Complexity | Performance Engineering | Planned |
| May 6      | Newsletter #13 | Edge Computing (feature blog)             | performance             | Planned |
| May 12 (B) | Newsletter #14 | Hiring Your First Staff Engineer          | leadership              | Planned |
| May 19 (A) | Blog           | Incident Response Playbook for SaaS Teams | Engineering Leadership  | Planned |
| May 20     | Newsletter #15 | Incident Response (feature blog)          | leadership              | Planned |
| May 27 (B) | Newsletter #16 | Choosing Between REST and GraphQL in 2026 | architecture            | Planned |

### June

| Week       | Type           | Title                                 | Hub/Pillar              | Status  |
| ---------- | -------------- | ------------------------------------- | ----------------------- | ------- |
| Jun 2 (A)  | Blog           | Caching Strategies That Actually Work | Performance Engineering | Planned |
| Jun 3      | Newsletter #17 | Caching Strategies (feature blog)     | performance             | Planned |
| Jun 9 (B)  | Newsletter #18 | When to Denormalize Your Database     | saas-patterns           | Planned |
| Jun 16 (A) | Blog           | LLM Cost Optimization at Scale        | AI Development          | Planned |
| Jun 23     | Newsletter #19 | LLM Cost Optimization (feature blog)  | ai-development          | Planned |
| Jun 30 (B) | Newsletter #20 | Q2 Retrospective: What Worked         | —                       | Planned |

---

## Spoke Pipeline (Next Posts by Hub)

New blog posts should extend existing hubs. Prioritize clusters with fewer spokes or higher business relevance.

### SaaS Architecture (currently 11 spokes)

- [ ] Database migration patterns for multi-tenant SaaS
- [ ] Event-driven architecture for SaaS at scale
- [ ] Serverless vs containers for SaaS workloads
- [ ] SaaS billing architecture with Stripe

### Engineering Leadership (currently 6 spokes)

- [ ] Incident response playbook for SaaS teams
- [ ] Code review practices that scale
- [ ] Documentation that engineers actually read
- [ ] Hiring your first staff engineer

### Frontend Architecture (currently 8 spokes)

- [ ] Testing strategies for React Server Components
- [ ] Monorepo patterns with Turborepo
- [ ] State management: Zustand vs signals vs server state
- [ ] Progressive Web Apps for SaaS

### Performance Engineering (currently 8 spokes)

- [ ] Core Web Vitals audit checklist (2026 update)
- [ ] Edge computing deep-dive
- [ ] Caching strategies (Redis, CDN, application-level)
- [ ] Real-time performance monitoring at scale

### AI Development (currently 6 spokes)

- [ ] RAG architecture for SaaS products
- [ ] Vector database comparison and selection guide
- [ ] LLM cost optimization at scale
- [ ] Building AI features that users actually adopt

---

## Content Themes by Quarter

### Q1: Foundation & Authority

- Establish the newsletter cadence
- Architecture-heavy content (monolith, microservices, multi-tenancy)
- AI integration patterns (timely — high search interest)

### Q2: Performance & Leadership

- Performance content (CWV updates, caching, edge)
- Leadership content (hiring, incident response, code review)
- Balance technical depth with management insights

### Q3: Frontend & SaaS Patterns

- Frontend architecture deep-dives (RSC, testing, state)
- SaaS-specific patterns (billing, event-driven, serverless)
- Cross-cluster posts linking frontend to SaaS decisions

### Q4: Contrarian & Retrospective

- Year-in-review analysis posts
- Contrarian takes (challenging 2026 trends)
- Planning-oriented content for teams starting 2027

---

## Newsletter-Only Topics (Week B Standalone Issues)

These don't need a full blog post — they're 500-700 word decision frameworks:

- The architecture decision I regret most
- How I replaced $500/mo in API costs
- The real cost of technical debt (quantified)
- Code review that actually adds value
- Choosing between REST and GraphQL in 2026
- When to denormalize your database
- Hiring your first staff engineer
- The 80/20 rule of database optimization
- Why your SaaS doesn't need Kubernetes
- Stop using Redis for everything

---

## Social Calendar Alignment

Every blog post generates a week of social content via n8n + Postiz:

```
Blog (Monday) → Twitter thread (Tuesday) → LinkedIn carousel (Wednesday)
                                         → Dev.to article (Monday)
                                         → Hot take (Thursday)
                                         → LinkedIn text (Friday)
```

Non-blog weeks use repurposed content from existing posts or newsletter insights.

See `docs/FEBRUARY_2026_CONTENT_CALENDAR.md` for the February-specific Postiz schedule.
See `docs/CONTENT_REPURPOSING_SYSTEM.md` for generation templates and prompts.
