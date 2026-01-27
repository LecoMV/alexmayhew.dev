# Newsletter Content Calendar - The Architect's Brief

> **Created:** 2026-01-27
> **Schedule:** Every Tuesday, 9 AM EST
> **Format:** See NEWSLETTER_STRATEGY.md for template

---

## Publishing Schedule

| Week | Send Date  | Status  | Topic                                           |
| ---- | ---------- | ------- | ----------------------------------------------- |
| 1    | 2026-02-04 | Draft   | Why Your SaaS Needs a Monolith First            |
| 2    | 2026-02-11 | Draft   | The Hidden Cost of Microservices                |
| 3    | 2026-02-18 | Draft   | PostgreSQL Row-Level Security for Multi-Tenancy |
| 4    | 2026-02-25 | Draft   | When NOT to Use Next.js                         |
| 5    | 2026-03-04 | Planned | Database Migrations That Won't Wake You at 3 AM |
| 6    | 2026-03-11 | Planned | The Architecture Decision I Regret Most         |
| 7    | 2026-03-18 | Planned | How I Replaced $500/mo in API Costs             |
| 8    | 2026-03-25 | Planned | The Real Cost of Technical Debt                 |

---

## Issue #1: Why Your SaaS Needs a Monolith First

**Send Date:** Tuesday, February 4, 2026
**Subject Line:** Why your SaaS needs a monolith (yes, really)

### This Week's Decision

**The Situation:**
You're building a new SaaS product. Your team debates: start with microservices for "scale" or build a monolith you'll "have to rewrite later."

**The Insight:**
The companies I advise that started with microservices spent 40-60% of their first year on infrastructure, not features. The ones that started with a well-structured monolith shipped faster and had clearer extraction points when they actually needed to scale.

**The Code:**

```typescript
// Good monolith structure - clear domain boundaries
src/
├── modules/
│   ├── auth/           # Future: Auth service
│   │   ├── auth.service.ts
│   │   ├── auth.controller.ts
│   │   └── auth.repository.ts
│   ├── billing/        # Future: Billing service
│   └── notifications/  # Future: Notification service
├── shared/
│   └── database/       # Shared until extraction
└── main.ts
```

The key is designing your monolith with clear module boundaries. When you need to extract, you have natural seams.

**When to Apply This:**

- You have fewer than 50 engineers
- You're still finding product-market fit
- Your traffic is under 10K RPM

### Links Worth Your Time

1. **[DHH on the Majestic Monolith](https://m.signalvnoise.com/the-majestic-monolith/)** - The original argument. Still holds up. Basecamp runs on a monolith serving millions.

2. **[Amazon's Microservices Journey](https://aws.amazon.com/blogs/architecture/)** - They started as a monolith. The extraction happened over years, not months.

3. **[Segment's Return to Monolith](https://segment.com/blog/goodbye-microservices/)** - After going full microservices, they came back. The operational overhead was killing them.

### Tool of the Week

**[Turborepo](https://turbo.build/repo)** - If you insist on splitting code early, at least keep it in a monorepo. Turborepo's caching makes builds fast, and you avoid the dependency hell of multiple repos.

### Sign-off

That's the architectural decision for this week.

Building something and not sure whether to go monolith or microservices? Hit reply—I read every response.

– Alex

---

## Issue #2: The Hidden Cost of Microservices

**Send Date:** Tuesday, February 11, 2026
**Subject Line:** The 73% overhead nobody warns you about

### This Week's Decision

**The Situation:**
Your engineering team pushes for microservices because "Netflix does it." Leadership wants to know the real cost.

**The Insight:**
In my experience advising startups, the teams that adopted microservices prematurely saw:

- 73% more infrastructure code (service mesh, tracing, discovery)
- 2-3x longer debugging sessions (distributed tracing is hard)
- 40% slower feature velocity in year one

The hidden costs aren't in the AWS bill. They're in cognitive load.

**The Code:**

```yaml
# What "simple" microservices actually require
services:
  - api-gateway # Route requests
  - auth-service # Handle authentication
  - user-service # User CRUD
  - billing-service # Stripe integration
  - notification-svc # Emails/push

infrastructure:
  - consul # Service discovery
  - envoy # Service mesh
  - jaeger # Distributed tracing
  - prometheus # Metrics
  - grafana # Dashboards
  - elasticsearch # Log aggregation
  - kafka # Event streaming
```

Count them. 12 systems to manage before you've written a single business feature.

**When to Apply This:**

- Your team is under 10 engineers: Stay monolith
- 10-50 engineers: Consider extracting 1-2 services
- 50+ engineers: Now microservices might make sense

### Links Worth Your Time

1. **[Monolith First - Martin Fowler](https://martinfowler.com/bliki/MonolithFirst.html)** - The canonical reference. Start monolith, extract when you feel the pain.

2. **[The Death of the Monolith was Greatly Exaggerated](https://shopify.engineering/)** - Shopify runs one of the largest Rails monoliths. Black Friday? No problem.

3. **[Local-First Software](https://www.inkandswitch.com/local-first/)** - A different paradigm entirely. Worth understanding as an alternative to the distributed systems tax.

### Tool of the Week

**[k6](https://k6.io/)** - Before you scale horizontally, know your actual limits. k6 lets you load test with JavaScript. Most monoliths handle more than you think.

---

## Issue #3: PostgreSQL Row-Level Security for Multi-Tenancy

**Send Date:** Tuesday, February 18, 2026
**Subject Line:** The Postgres feature that replaces thousands of lines of code

### This Week's Decision

**The Situation:**
You're building a multi-tenant SaaS. Every query needs `WHERE tenant_id = ?`. Miss one, and you've got a data breach.

**The Insight:**
PostgreSQL Row-Level Security (RLS) enforces tenant isolation at the database level. You can't forget a WHERE clause because the database won't return rows you shouldn't see.

**The Code:**

```sql
-- Enable RLS on the table
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policy: users only see their tenant's data
CREATE POLICY tenant_isolation ON projects
  USING (tenant_id = current_setting('app.tenant_id')::uuid);

-- In your app, set the tenant context
SET app.tenant_id = 'tenant-uuid-here';

-- Now this query is automatically filtered
SELECT * FROM projects;
-- Only returns projects for the current tenant
```

No more `WHERE tenant_id = ?` everywhere. No more security audits finding missed clauses.

**When to Apply This:**

- Multi-tenant SaaS with shared database
- Healthcare, fintech, or any regulated industry
- You're tired of writing tenant filters

### Links Worth Your Time

1. **[Crunchy Data RLS Guide](https://www.crunchydata.com/blog/row-level-security-in-postgresql)** - Comprehensive walkthrough with performance considerations.

2. **[Supabase RLS Patterns](https://supabase.com/docs/guides/auth/row-level-security)** - Practical patterns from a company built on RLS.

3. **[The Perils of Shared Database Multi-Tenancy](https://blog.arkency.com/)** - Why isolation matters and the approaches beyond RLS.

### Tool of the Week

**[pgAudit](https://www.pgaudit.org/)** - Once you have RLS, add auditing. Know who accessed what, when. Essential for compliance.

---

## Issue #4: When NOT to Use Next.js

**Send Date:** Tuesday, February 25, 2026
**Subject Line:** The Next.js escape hatch nobody talks about

### This Week's Decision

**The Situation:**
Your team assumes Next.js is the default for all React projects. But you're building an internal dashboard with no SEO requirements.

**The Insight:**
Next.js adds complexity you pay for whether you need it or not:

- Server components mental model
- Caching behavior surprises
- Build times for large apps
- Vercel-optimized patterns that work less well elsewhere

For apps that don't need SSR/SSG, a simpler setup wins.

**The Code:**

```typescript
// For internal tools, consider Vite + React Router
// vite.config.ts
export default defineConfig({
	plugins: [react()],
	server: { port: 3000 },
});

// No server components to reason about
// No caching surprises
// 10x faster dev server startup
// Deploy anywhere (it's just static files + API)
```

**When to skip Next.js:**

- Internal dashboards
- Admin panels
- Apps behind authentication (no SEO needed)
- Real-time apps (WebSocket-heavy)
- When your team knows React but not Next.js

**When Next.js is the right choice:**

- Public-facing marketing sites
- E-commerce (SEO + dynamic)
- Content sites with preview
- When you're deploying to Vercel

### Links Worth Your Time

1. **[Remix vs Next.js](https://remix.run/blog/remix-vs-next)** - Honest comparison from the Remix team. Different tradeoffs.

2. **[Why I Moved Away from Next.js](https://dev.to/)** - Real-world experience from someone who migrated away.

3. **[Vite 5 Announcement](https://vitejs.dev/blog/)** - If you're going SPA, Vite is the build tool to use.

### Tool of the Week

**[TanStack Router](https://tanstack.com/router)** - Type-safe routing for SPAs. If you're not using Next.js, this is the routing library to reach for.

---

## Content Pillar Topics (Future Issues)

### Architecture Decisions

- [ ] Choosing between REST and GraphQL
- [ ] Event-driven vs request-response
- [ ] Serverless vs containers
- [ ] Edge computing tradeoffs

### Database & Data

- [ ] When to denormalize
- [ ] Time-series data patterns
- [ ] Search: Postgres vs Elasticsearch vs Typesense
- [ ] Caching strategies that actually work

### Performance

- [ ] Core Web Vitals deep dive
- [ ] Database query optimization
- [ ] CDN strategies for dynamic content
- [ ] Measuring what matters

### Team & Process

- [ ] Technical debt quantification
- [ ] Code review that adds value
- [ ] Documentation that gets read
- [ ] Incident response playbooks

### AI/ML Integration

- [ ] When to build vs buy AI features
- [ ] Vector databases for search
- [ ] LLM cost optimization
- [ ] RAG system architecture

---

## Subject Line Bank

**Curiosity:**

- The [X] nobody warns you about
- Why your [X] needs [Y] (yes, really)
- The [metric] that changed how I [action]
- I was wrong about [common belief]

**Specific:**

- How I reduced [metric] by [percentage]
- The [tool/pattern] that replaces [many] lines of code
- [Number] [things] every [role] should know about [topic]

**Question:**

- Is [common practice] actually a mistake?
- When should you NOT use [popular thing]?
- Why is [unexpected thing] faster than [expected thing]?

---

## Metrics to Track

| Metric      | Week 1 Target | Month 1 Target | Month 3 Target |
| ----------- | ------------- | -------------- | -------------- |
| Subscribers | 100           | 500            | 2,000          |
| Open Rate   | 40%+          | 35%+           | 30%+           |
| Click Rate  | 5%+           | 4%+            | 3%+            |
| Reply Rate  | 5%+           | 3%+            | 2%+            |
| Unsubscribe | <1%           | <0.5%          | <0.3%          |

---

## Automation Notes

Once n8n is set up, automate:

1. **New blog post → Newsletter section draft** (Gemma 2 9B)
2. **Newsletter send → Social posts scheduled** (LinkedIn + Twitter)
3. **Subscriber milestone → Celebration post**

See `docs/CONTENT_REPURPOSING_SYSTEM.md` for prompts.
