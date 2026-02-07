# Social Content: Performance Engineering Cluster (5 Posts)

---

## Post 1: Database Migration Patterns (Publish: Mar 2)

**Slug:** `database-migration-patterns`

### LinkedIn Post 1 (Mon Mar 2)

Every database migration guide tells you to "plan carefully" and "test in staging."

Neither prevents the 3 AM wake-up call.

The real problem: most migration strategies work perfectly on a 10GB dev database and catastrophically fail on a 2TB production instance with 50K concurrent connections.

I've helped 6 SaaS teams migrate production databases without downtime. The pattern that works every time is expand-contract:

1. Add the new column/table alongside the old one
2. Write to both, read from old
3. Backfill historical data in batches (not one massive UPDATE)
4. Switch reads to new
5. Remove old column after verification period

The batching matters more than the strategy. A single UPDATE on 50M rows locks the table for 45 minutes. Batches of 10K with pg_sleep(0.1) between them complete in 2 hours with zero lock contention.

The 30-second rule: if any single migration step takes longer than 30 seconds on production data, it needs to be broken into smaller steps or run asynchronously.

What's the largest database migration you've executed without downtime, and what was your approach?

### LinkedIn Post 2 (Tue Mar 3)

The most dangerous database migration isn't a schema change. It's a data migration.

Schema changes are predictable. Add column, create index, alter type. The DDL is deterministic.

Data migrations have conditional logic. "Update all users where X, set Y based on Z." And the edge cases in production data that don't exist in staging will break your migration at 2 AM.

Three rules I enforce for every data migration:

Rule 1: Never UPDATE without a WHERE clause that you've verified returns the expected count. Run SELECT COUNT(\*) first.

Rule 2: Always batch. 10K rows per transaction, with a configurable sleep between batches. Your replication lag will thank you.

Rule 3: Make it resumable. Track progress in a separate table. When (not if) the migration fails mid-way, you need to restart from the failure point, not the beginning.

I've seen a single unbatched UPDATE statement cause 45 minutes of table-level locks, 12 minutes of replication lag, and a cascade of connection pool exhaustion across 3 dependent services.

How does your team handle data migrations differently from schema migrations?

### LinkedIn Post 3 (Wed Mar 4)

CREATE INDEX on a 50M row table: 45 minutes of table locks if you forget one word.

That word is CONCURRENTLY.

Standard CREATE INDEX acquires a write lock on the entire table. On a table serving 10K writes per minute, that's 450K blocked write operations.

CREATE INDEX CONCURRENTLY builds the index without locking writes. It takes 2-3x longer but maintains full availability.

The catch: CONCURRENTLY can fail silently. It creates an INVALID index that looks normal in most tools but doesn't get used by the query planner. Always verify:

SELECT indexname, indisvalid FROM pg_indexes JOIN pg_index ON indexrelid = (SELECT oid FROM pg_class WHERE relname = 'your_table') WHERE NOT indisvalid;

One more: CREATE INDEX CONCURRENTLY cannot run inside a transaction. If your migration tool wraps everything in BEGIN/COMMIT, you need to handle index creation separately.

What migration tool does your team use, and does it handle CONCURRENTLY correctly?

### LinkedIn Post 4 (Thu Mar 5)

Multi-tenant SaaS migrations are a different beast.

When 200 tenants share a database, a migration that works for tenant A might fail for tenant B because their data patterns are completely different.

Tenant A has 500 rows in the orders table. Tenant B has 5 million. The migration that completes in 200ms for tenant A takes 45 minutes for tenant B, and your migration framework doesn't know the difference.

The approach I recommend: tenant-aware migration batching.

Instead of migrating all data in one pass, iterate by tenant. Process each tenant as a unit. If tenant B fails, tenant A's migration is already complete and unaffected.

For schema changes that affect all tenants equally, use the expand-contract pattern so the old schema remains functional while migration progresses.

The hardest part isn't the technical execution. It's testing. You need production-representative data for your largest tenants, not just the median.

How do you handle migrations differently for your largest vs smallest tenants?

### X Tweet 1 (Tue Mar 3)

A single unbatched UPDATE on 50M rows caused 45 minutes of table locks. Batches of 10K with pg_sleep(0.1) between them: zero lock contention, 2 hours total. Always batch.

### X Tweet 2 (Wed Mar 4)

CREATE INDEX vs CREATE INDEX CONCURRENTLY on a production table: the difference between 45 minutes of blocked writes and zero downtime. One word. Check your migration scripts.

### X Tweet 3 (Thu Mar 5)

The 30-second rule for database migrations: if any single step takes longer than 30 seconds on production data, break it into smaller steps. Saved me from 3 AM incidents more than any other rule.

### Dev.to Article

**Title:** Database Migrations That Won't Wake You at 3 AM
**Canonical URL:** https://alexmayhew.dev/blog/database-migration-patterns

Most database migration guides focus on the tools. Flyway vs Alembic vs Prisma Migrate. The tooling matters less than the strategy—and the strategy most teams use (run DDL in a transaction, hope for the best) fails predictably at scale.

After helping 6 SaaS teams migrate production databases ranging from 500GB to 4TB, I've identified the patterns that consistently prevent downtime and the anti-patterns that consistently cause incidents.

**The Expand-Contract Pattern**

Every migration should follow expand-contract:

1. Add new structure alongside old (expand)
2. Write to both, read from old
3. Backfill historical data
4. Switch reads to new
5. Remove old structure (contract)

This sounds heavyweight for a simple column rename, but the alternative—a direct ALTER TABLE RENAME—acquires an ACCESS EXCLUSIVE lock. On a table with active transactions, that lock can cascade into connection pool exhaustion within seconds.

**Batching Is Not Optional**

The most common migration failure I see: a single UPDATE statement touching millions of rows. The fix:

```sql
DO $$
DECLARE
  batch_size INT := 10000;
  affected INT;
BEGIN
  LOOP
    UPDATE orders SET status_new = status_old
    WHERE id IN (
      SELECT id FROM orders
      WHERE status_new IS NULL
      LIMIT batch_size
      FOR UPDATE SKIP LOCKED
    );
    GET DIAGNOSTICS affected = ROW_COUNT;
    EXIT WHEN affected = 0;
    PERFORM pg_sleep(0.1);
    COMMIT;
  END LOOP;
END $$;
```

`SKIP LOCKED` is the key: it skips rows locked by other transactions instead of waiting. No lock contention, no blocked queries.

**The 30-Second Rule**

If any migration step takes longer than 30 seconds on production-sized data, it needs to be broken down. This single rule prevents more incidents than any tool or framework.

Test every migration against production-representative data volumes before deploying. Your 10GB staging database will never reveal the problems your 2TB production database will.

Read the full post with more patterns including CONCURRENTLY index creation, multi-tenant migration strategies, and rollback planning: https://alexmayhew.dev/blog/database-migration-patterns

### Newsletter Section

**This Week's Decision: How Should You Run Database Migrations?**

**Situation:** Your SaaS database has grown past 100GB. Migrations that used to complete in seconds now take minutes. Last week, a column addition caused 30 seconds of degraded performance during peak traffic.

**Insight:** The expand-contract pattern eliminates migration downtime by never removing or altering existing structures in-place. Add the new structure alongside the old, migrate data in batches, switch reads, then remove the old structure in a separate deployment. The 30-second rule applies: if any single migration step takes longer than 30 seconds on production data, it needs decomposition.

**When to Apply:** SaaS databases over 50GB, tables with 10M+ rows, or any migration during business hours with active users.

**When NOT to Apply:** Early-stage products with small datasets where migration speed doesn't matter and downtime windows are acceptable.

---

## Post 2: Core Web Vitals Audit Checklist (Publish: Apr 1)

**Slug:** `core-web-vitals-2026-audit`

### LinkedIn Post 1 (Mon Mar 30)

40% of websites are failing the new Core Web Vitals threshold and most don't know it.

INP (Interaction to Next Paint) replaced FID in March 2024. FID measured the delay before your first interaction. INP measures the delay of every interaction, including the rendering time.

A site that passed FID at 50ms can fail INP at 400ms because FID ignored the 350ms the browser spent rendering the response.

The audit process I use with clients:

Step 1: Check CrUX data (real users), not Lighthouse (synthetic). PageSpeed Insights shows both—the CrUX section is the one Google uses for ranking.

Step 2: Filter by device. Mobile INP is typically 2-4x worse than desktop. If 60% of your traffic is mobile, your desktop score is irrelevant.

Step 3: Identify the worst pages, not the average. Your marketing site might score 100ms INP while your dashboard scores 800ms. Google evaluates per-page, not per-domain.

Step 4: Measure with the web-vitals library in production, not just in audits. Performance regressions happen between audits.

What's your current INP score, and have you checked it since the FID replacement?

### LinkedIn Post 2 (Tue Mar 31)

Lighthouse gives you a 95 performance score. Your CrUX data shows failing Core Web Vitals. Both are correct.

Lighthouse runs on a simulated mid-tier device with a fast connection. Your real users are on 3-year-old phones over cellular networks.

The gap between synthetic and real user metrics is the most dangerous blind spot in frontend performance. I've seen teams celebrate Lighthouse scores of 90+ while 35% of their real users experienced INP over 500ms.

Three metrics that matter (from real users, not synthetic):

LCP under 2.5 seconds on 75th percentile
INP under 200ms on 75th percentile
CLS under 0.1 on 75th percentile

The 75th percentile threshold means you need 75% of your users to pass, not the median. If your mobile users are failing, your aggregate might still pass if desktop traffic is high enough—but those mobile users are having a terrible experience.

Set up RUM (Real User Monitoring) with the web-vitals library. It takes 20 lines of code and gives you the data Google actually uses.

Are you measuring Core Web Vitals from real users or only from Lighthouse?

### LinkedIn Post 3 (Wed Apr 1)

The fastest way to fix a failing INP score: find your heaviest event handler and break it up.

INP measures the full round-trip of an interaction: input delay + processing time + presentation delay. Most failures happen in processing time—a click handler that runs 200ms of synchronous JavaScript.

The fix is yield-to-main. Break long tasks into smaller chunks so the browser can paint between them.

Before: One 300ms task blocks the main thread.
After: Three 100ms tasks with yields. Browser paints after the first chunk.

The scheduler.yield() API (available in Chrome 2025+) is the cleanest solution. For broader browser support, setTimeout(0) achieves the same result with slightly more overhead.

Where to look first: event handlers on data tables (sorting, filtering), form submissions with client-side validation, and any click that triggers a state update affecting 50+ DOM nodes.

Virtualization is the nuclear option. If your table renders 1,000 rows and the user scrolls, you're updating 1,000 DOM nodes. Virtual scrolling renders only the visible 20-30 rows. INP drops from 400ms to under 50ms.

What interaction on your site has the highest INP, and do you know why?

### LinkedIn Post 4 (Thu Apr 2)

CLS (Cumulative Layout Shift) is the easiest Core Web Vital to fix and the most annoying for users.

Every time an element moves after the page starts rendering, that's layout shift. Ad banners loading late, images without dimensions, fonts swapping—each one pushes content around and frustrates users trying to click.

The three biggest CLS offenders I find in audits:

1. Images without explicit width and height. The browser reserves zero space until the image loads, then shifts everything below it. Fix: always set width/height attributes or use aspect-ratio CSS.

2. Web fonts causing FOUT (Flash of Unstyled Text). The fallback font has different metrics than the custom font, causing text to reflow. Fix: font-display: optional (skip the custom font if it doesn't load fast enough) or size-adjust to match fallback metrics.

3. Dynamically injected content above the viewport. Cookie banners, notification bars, chat widgets that push the page down after initial render. Fix: reserve space with min-height or use overlay positioning.

The testing trap: CLS accumulates during the full page lifecycle, not just initial load. A user who scrolls for 2 minutes might accumulate CLS from lazy-loaded content that a quick Lighthouse test never sees.

What's the most frustrating layout shift you've encountered as a user?

### X Tweet 1 (Tue Mar 31)

40% of websites fail the INP Core Web Vital and most don't know it. INP replaced FID in 2024 and measures every interaction, not just the first. Check CrUX data, not Lighthouse.

### X Tweet 2 (Wed Apr 1)

Lighthouse says 95. CrUX says failing. Both are correct. Lighthouse simulates a fast device. CrUX measures your actual users on 3-year-old phones over cellular. Measure real users with the web-vitals library.

### X Tweet 3 (Thu Apr 2)

The fastest INP fix: find your heaviest click handler, break it into chunks with scheduler.yield(). A 300ms synchronous task becomes three 100ms tasks with browser paints between them. Users notice immediately.

### Dev.to Article

**Title:** Core Web Vitals Audit Checklist for 2026
**Canonical URL:** https://alexmayhew.dev/blog/core-web-vitals-2026-audit

Google's Core Web Vitals changed significantly in 2024 with the replacement of FID by INP, and 40% of websites are still failing the new threshold. Here's the audit checklist I use with advisory clients.

**The Three Metrics**

- **LCP (Largest Contentful Paint):** Under 2.5s at 75th percentile
- **INP (Interaction to Next Paint):** Under 200ms at 75th percentile
- **CLS (Cumulative Layout Shift):** Under 0.1 at 75th percentile

The 75th percentile means 75% of your real user experiences must pass, not the median or average.

**Step 1: Measure Real Users, Not Synthetic**

Lighthouse is useful for development. CrUX (Chrome User Experience Report) is what Google uses for ranking. Set up Real User Monitoring:

```typescript
import { onLCP, onINP, onCLS } from "web-vitals";

function sendToAnalytics(metric) {
	navigator.sendBeacon(
		"/api/vitals",
		JSON.stringify({
			name: metric.name,
			value: metric.value,
			id: metric.id,
			page: window.location.pathname,
			connection: navigator.connection?.effectiveType || "unknown",
		})
	);
}

onLCP(sendToAnalytics);
onINP(sendToAnalytics);
onCLS(sendToAnalytics);
```

**Step 2: Segment by Device**

Mobile INP is typically 2-4x worse than desktop. If 60% of your traffic is mobile, your desktop scores are irrelevant.

**Step 3: Fix INP First**

INP is where most sites fail. The fix: break long tasks with `scheduler.yield()` or `setTimeout(0)`. For data-heavy UIs, implement virtualization—render only visible rows instead of the full dataset.

**Step 4: Fix CLS**

Always set image dimensions. Use `font-display: optional` or `size-adjust` for web fonts. Reserve space for dynamically injected content (cookie banners, chat widgets).

**Step 5: Fix LCP**

Preload the LCP image. Use `fetchpriority="high"` on the hero image. Avoid render-blocking CSS by inlining critical styles.

Read the full audit checklist with detailed code examples and tool recommendations: https://alexmayhew.dev/blog/core-web-vitals-2026-audit

### Newsletter Section

**This Week's Decision: Are You Measuring the Right Web Vitals?**

**Situation:** Your Lighthouse score is 90+, but you've noticed organic traffic declining. Google replaced FID with INP in 2024, and 40% of websites are failing the new threshold without knowing it.

**Insight:** INP measures every interaction's round-trip time (input delay + processing + rendering), not just the first interaction like FID did. Sites that passed FID at 50ms commonly fail INP at 400ms. The fix: measure real users with the web-vitals library (20 lines of code), segment by device type (mobile INP is 2-4x worse than desktop), and break long event handlers with scheduler.yield() or virtualization for data-heavy UIs.

**When to Apply:** Any site where organic search traffic matters. Google uses CrUX (real user) data for ranking, not Lighthouse scores.

**When NOT to Apply:** Internal tools, B2B products where users arrive via direct link, or products where SEO isn't a growth channel.

---

## Post 3: Edge Computing for SaaS (Publish: May 5)

**Slug:** `edge-computing-saas`

### LinkedIn Post 1 (Mon May 4)

Edge computing reduces latency from 200ms to 20ms for users far from your origin server.

It also increases your infrastructure complexity by 3x and your debugging difficulty by 5x.

The question isn't whether edge is faster. It's whether the latency reduction justifies the operational cost for your specific application.

Three conditions where edge computing delivers real value for SaaS:

1. Your users are globally distributed AND latency-sensitive (real-time collaboration, gaming, financial data)
2. Your read-to-write ratio exceeds 10:1 (content delivery, dashboards, configuration lookups)
3. You need data residency compliance (EU users' data processed in EU, not forwarded to US-East-1)

Three conditions where edge computing is premature:

1. 80%+ of your users are in one region
2. Your application is write-heavy (every write still goes to the origin database)
3. Your team has fewer than 3 infrastructure engineers (the operational overhead will consume them)

I've advised teams that saved $40K/year by removing edge deployments they didn't need. The origin server with a CDN for static assets was fast enough.

Does your application's user distribution actually justify edge deployment?

### LinkedIn Post 2 (Tue May 5)

The hardest problem in edge computing isn't deploying code to edge locations. It's data consistency.

Your code runs in 200 edge locations. Your database runs in one.

Every write operation from an edge function traverses the full network back to origin. The "20ms edge latency" becomes 220ms when the function needs to read from or write to the database.

Three patterns that work:

Pattern 1: Read-at-edge, write-at-origin. Cache frequently-read data at edge locations. All mutations go to the origin. Works for 80% of SaaS read patterns.

Pattern 2: Regional databases with async replication. Run database replicas in 3-5 regions. Reads go to the nearest replica. Writes go to the primary. Eventual consistency with 100-500ms lag.

Pattern 3: CRDTs for collaborative features. Conflict-free replicated data types let multiple edge locations accept writes that merge automatically. Complex to implement but enables true multi-region writes.

Most SaaS applications need Pattern 1 only. Pattern 2 is for applications serving 3+ continents with latency SLAs. Pattern 3 is for real-time collaboration (think Figma, Google Docs).

Which edge data pattern would actually help your application?

### LinkedIn Post 3 (Wed May 6)

The edge computing cost calculation most teams get wrong:

They compare: "Lambda in us-east-1 at $X/month" vs "Cloudflare Workers at $Y/month" and pick the cheaper option.

The real comparison includes:

Infrastructure cost: Workers are often cheaper per-request than Lambda at scale. But edge databases (Turso, Neon) cost more than a single RDS instance.

Development cost: Edge has runtime constraints. No Node.js APIs, limited execution time, smaller bundle limits. Every library that doesn't work at the edge costs engineering time to replace.

Debugging cost: A bug that only reproduces at the Sydney edge location but not in your US development environment takes 3x longer to diagnose than an origin server bug.

Monitoring cost: 200 edge locations means 200x the data points in your monitoring stack. Alerting needs to distinguish between a global issue and a single-location anomaly.

For a B2B SaaS with 90% US traffic, a well-configured origin server with a CDN costs $500/month with simple operations. The same application on edge costs $800/month with 3x operational complexity.

Have you calculated the full operational cost of your edge deployment, or just the compute cost?

### LinkedIn Post 4 (Thu May 7)

Cloudflare Workers are the best starting point for SaaS edge computing. Not because they're the fastest. Because the constraints force good architecture.

25ms CPU time limit per request. 128MB memory. No Node.js runtime. No file system.

These constraints eliminate the most common edge computing mistakes:

You can't run a 500ms database query because you'll hit the CPU limit. So you cache aggressively and design for read-at-edge, write-at-origin.

You can't bundle a 50MB Node.js application. So you keep edge functions small and focused.

You can't access the file system for temporary storage. So you use KV or Durable Objects, which are distributed by design.

The teams I've advised that started with a "run everything at the edge" approach spent months fighting runtime limitations. The teams that started with "only put read-heavy, latency-sensitive paths at the edge" shipped in weeks.

Start with your CDN configuration. Then move authentication checks to the edge. Then static content rendering. Stop there for most applications.

What would you move to the edge first in your application?

### X Tweet 1 (Tue May 5)

Edge computing cuts latency from 200ms to 20ms. It also increases debugging difficulty by 5x. If 80% of your users are in one region, a well-configured origin with a CDN is probably enough.

### X Tweet 2 (Wed May 6)

The hardest edge computing problem isn't deployment. It's data. Your code runs in 200 locations, your database in one. Every write still goes to origin. "20ms edge latency" becomes 220ms for anything that touches the database.

### X Tweet 3 (Thu May 7)

Cloudflare Workers' 25ms CPU limit is a feature, not a bug. It forces you to cache aggressively and keep edge functions small. The constraint prevents the "run everything at the edge" mistake that wastes months.

### Dev.to Article

**Title:** Edge Computing for SaaS: When It's Worth the Complexity
**Canonical URL:** https://alexmayhew.dev/blog/edge-computing-saas

Edge computing promises 20ms latency instead of 200ms. The marketing is compelling. The reality is more nuanced—and I've helped teams both adopt and remove edge deployments.

**The Decision Framework**

Edge computing delivers real ROI when three conditions are met simultaneously:

1. Users are globally distributed AND latency-sensitive
2. Read-to-write ratio exceeds 10:1
3. You have infrastructure engineers who can manage the operational complexity

If any condition is missing, a well-configured origin server with a CDN handles most use cases at lower operational cost.

**The Data Problem**

Your code runs in 200 edge locations. Your database runs in one. Three patterns solve this:

1. **Read-at-edge, write-at-origin**: Cache reads at edge, send all writes to origin. Covers 80% of SaaS patterns.
2. **Regional databases**: Replicas in 3-5 regions with async replication. For multi-continent applications with latency SLAs.
3. **CRDTs**: Conflict-free replicated data types for real-time collaboration features.

**The Hidden Costs**

The compute cost is often comparable or cheaper at edge. The hidden costs are:

- Development: Edge runtime constraints (no Node.js APIs, bundle limits) require rewriting code
- Debugging: Bugs that only reproduce at specific edge locations take 3x longer to diagnose
- Monitoring: 200 locations means 200x data points

**Where to Start**

If you decide edge is right for your application:

1. CDN configuration for static assets
2. Authentication/authorization checks at edge
3. Static content rendering (marketing pages, documentation)
4. Stop there for most applications

Read the full analysis with cost comparisons and implementation patterns: https://alexmayhew.dev/blog/edge-computing-saas

### Newsletter Section

**This Week's Decision: Should You Deploy to the Edge?**

**Situation:** Your SaaS has users in Europe and Asia experiencing 200ms+ latency to your US-East origin. A team member suggests deploying to Cloudflare Workers to "fix latency globally."

**Insight:** Edge computing reduces read latency from ~200ms to ~20ms, but every write still goes to your origin database. If your application is write-heavy or 80%+ of users are in one region, a CDN with proper cache headers achieves 80% of the benefit at 10% of the operational complexity. The three conditions for edge ROI: globally distributed users, 10:1+ read-to-write ratio, and infrastructure team capacity to manage distributed debugging.

**When to Apply:** Multi-continent SaaS with latency-sensitive features (real-time collaboration, financial dashboards) and dedicated infrastructure engineers.

**When NOT to Apply:** B2B SaaS with concentrated user geography, write-heavy applications, or teams under 3 infrastructure engineers.

---

## Post 4: Caching Strategies in Production (Publish: Jun 2)

**Slug:** `caching-strategies-production`

### LinkedIn Post 1 (Mon Jun 1)

The fastest database query is the one you never make.

Caching is the single highest-ROI performance optimization for SaaS applications. A $0.02 Redis lookup replaces a $0.50 database query that takes 100x longer.

But most caching implementations fail not because the cache doesn't work. They fail because invalidation is wrong.

The caching pyramid I recommend:

Layer 1: Browser cache (Cache-Control headers). Free. Zero server load. Handles static assets and API responses that change infrequently.

Layer 2: CDN cache (Cloudflare, CloudFront). $0.01/10K requests. Serves identical responses to different users without hitting your origin.

Layer 3: In-process cache (Node.js LRU). Free. Sub-millisecond. Perfect for configuration data, feature flags, and computed values that change hourly.

Layer 4: Distributed cache (Redis). $0.02/request. Shared across all application instances. Session data, user preferences, frequently-read database rows.

Layer 5: Database query cache (materialized views). Built into PostgreSQL. Precomputed results for expensive aggregate queries.

Most teams jump straight to Layer 4 (Redis) and skip Layers 1-3. A proper Cache-Control header on your API responses eliminates more server load than Redis ever will.

Which layer of the caching pyramid is your application missing?

### LinkedIn Post 2 (Tue Jun 2)

There are only two hard problems in computer science: cache invalidation and naming things.

The naming thing is a joke. Cache invalidation genuinely ruins engineering weeks.

Three invalidation patterns that actually work in production:

TTL-based: Set an expiration time. Accept that data might be stale for N seconds. Simple, predictable, works for 80% of use cases. Most SaaS applications can tolerate 60-second staleness for dashboard data.

Event-driven: When data changes, publish an event that invalidates the relevant cache keys. Precise but requires a reliable event bus and careful key management. One missed event = stale data with no TTL safety net.

Stale-while-revalidate: Return the cached (potentially stale) response immediately, then refresh the cache in the background. The user gets a fast response. The next user gets fresh data. Best of both worlds for read-heavy endpoints.

The anti-pattern: cache everything with no TTL and invalidate manually. This works until someone forgets to add invalidation for a new write path. Then customers see stale data for hours.

My default recommendation: TTL of 60 seconds for most API responses, event-driven invalidation for critical data (billing, permissions), and stale-while-revalidate for dashboard data.

What cache invalidation strategy does your team use, and how often does it fail?

### LinkedIn Post 3 (Wed Jun 3)

Redis is not a database. Stop treating it like one.

I've audited 12 SaaS applications that used Redis as a primary data store for session data, rate limiting, and feature flags. In 9 of them, a Redis restart caused user-facing outages because the application couldn't function without cached data.

Redis is a cache. Caches are ephemeral by design. If your application breaks when Redis is empty, you have an architecture problem.

Three rules for Redis in production:

Rule 1: Every Redis read must have a database fallback. If the cache misses, fetch from the source of truth. The code path exists whether Redis is up or not.

Rule 2: Set maxmemory-policy to allkeys-lru. When Redis fills up, it evicts least-recently-used keys automatically. Without this, Redis returns OOM errors and your application crashes.

Rule 3: Never store data in Redis that doesn't exist elsewhere. Session tokens should be in Redis AND your database. Rate limit counters should degrade gracefully if Redis is unavailable (allow requests rather than block all traffic).

The exception: Redis as a message broker (pub/sub, streams) is a valid primary use case. But that's using Redis as a messaging system, not as a database.

How does your application behave when Redis is completely unavailable?

### LinkedIn Post 4 (Thu Jun 4)

The most underused caching strategy in SaaS: HTTP Cache-Control headers on API responses.

Most SaaS APIs return Cache-Control: no-cache or no caching headers at all. Every request hits your server. Every identical dashboard load makes the same 15 API calls.

For read-heavy endpoints where data changes infrequently:

Cache-Control: public, max-age=60, stale-while-revalidate=300

This single header:

- Caches the response in the browser for 60 seconds (zero network requests)
- Caches in the CDN for 60 seconds (zero origin hits)
- Serves stale content for up to 5 minutes while revalidating in the background

For a dashboard API serving 1,000 users who each load 15 endpoints every 5 minutes, this reduces origin requests from 180K/hour to under 3K/hour. A 98% reduction with one HTTP header.

The objection I always hear: "But our data needs to be real-time." For most SaaS dashboards, 60-second staleness is invisible to users. The exception is financial data, messaging, and collaborative editing—those genuinely need real-time updates via WebSocket, not polling.

Have you measured what percentage of your API responses could be cached for 60 seconds without users noticing?

### X Tweet 1 (Tue Jun 2)

The fastest database query is the one you never make. A $0.02 Redis lookup replaces a $0.50 database query that takes 100x longer. But most teams skip HTTP caching headers, which eliminate server load entirely. Free.

### X Tweet 2 (Wed Jun 3)

Redis is not a database. If your application crashes when Redis restarts, you have an architecture problem. Every Redis read must have a database fallback. Set maxmemory-policy to allkeys-lru. Never store data only in Redis.

### X Tweet 3 (Thu Jun 4)

One HTTP header reduced API origin requests by 98%: Cache-Control: public, max-age=60, stale-while-revalidate=300. Most SaaS dashboards can tolerate 60-second staleness. Users won't notice. Your servers will.

### Dev.to Article

**Title:** Caching Strategies That Actually Work in Production
**Canonical URL:** https://alexmayhew.dev/blog/caching-strategies-production

Caching is the highest-ROI performance optimization for SaaS. But most implementations fail at invalidation, not at caching itself. Here's the production-tested approach.

**The Caching Pyramid**

Layer your caches from cheapest to most expensive:

1. **Browser cache** (Cache-Control headers): Free, zero server load
2. **CDN cache** (Cloudflare/CloudFront): $0.01/10K requests
3. **In-process cache** (Node.js LRU): Sub-millisecond, for config/feature flags
4. **Distributed cache** (Redis): $0.02/request, shared across instances
5. **Database query cache** (materialized views): For expensive aggregates

Most teams jump to Redis and skip layers 1-3. A proper `Cache-Control` header eliminates more server load than Redis.

**Cache Invalidation That Works**

Three patterns, in order of complexity:

1. **TTL-based**: Set expiration. Accept N seconds of staleness. Works for 80% of cases. My default: 60 seconds for API responses.
2. **Event-driven**: Publish events on data change to invalidate cache keys. Precise but requires reliable event bus.
3. **Stale-while-revalidate**: Return cached response immediately, refresh in background. Best for dashboard data.

**Redis Rules**

- Every Redis read needs a database fallback
- Set `maxmemory-policy` to `allkeys-lru`
- Never store data only in Redis
- If your app breaks when Redis is empty, you have an architecture problem

**The HTTP Caching Quick Win**

```
Cache-Control: public, max-age=60, stale-while-revalidate=300
```

For a dashboard API serving 1,000 users loading 15 endpoints every 5 minutes: origin requests drop from 180K/hour to under 3K/hour. One header, 98% reduction.

Read the full guide with code examples and production configurations: https://alexmayhew.dev/blog/caching-strategies-production

### Newsletter Section

**This Week's Decision: Where Should You Add Caching First?**

**Situation:** Your SaaS dashboard loads slowly. The database is handling 180K API requests per hour. Your team is evaluating Redis, but setup and invalidation seem complex.

**Insight:** Start with HTTP Cache-Control headers, not Redis. Adding `Cache-Control: public, max-age=60, stale-while-revalidate=300` to read-heavy API endpoints reduces origin requests by up to 98% with zero infrastructure changes. Most dashboard data can tolerate 60-second staleness without users noticing. Layer caches from cheapest to most expensive: browser headers, CDN, in-process LRU, then Redis for shared state.

**When to Apply:** Any SaaS with read-heavy API endpoints (dashboards, reports, configuration lookups) where 60-second data freshness is acceptable.

**When NOT to Apply:** Real-time collaboration, financial trading platforms, or messaging applications where sub-second freshness is required.

---

## Post 5: Real-Time Performance Monitoring (Publish: Jul 14)

**Slug:** `real-time-performance-monitoring`

### LinkedIn Post 1 (Mon Jul 13)

Your monitoring dashboard says everything is fine. Your customers say the app is slow.

The gap exists because you're measuring averages. And averages lie.

A SaaS application serving 10,000 requests per minute with a 200ms average response time sounds healthy. But the distribution tells a different story:

p50: 120ms (5,000 requests — fast)
p75: 250ms (2,500 requests — acceptable)
p90: 800ms (1,000 requests — noticeable)
p95: 2,500ms (500 requests — frustrating)
p99: 8,000ms (100 requests — broken)

That "200ms average" hides 100 requests per minute that take 8 seconds. Those 100 requests aren't random. They correlate with enterprise customers running complex queries, users on mobile networks, and requests hitting unoptimized code paths.

The average tells you the system is fine. The p99 tells you 1% of users are having a terrible experience—and those users are often paying the most.

Switch from averages to percentiles. Alert on p99, not p50. This single change catches performance degradation weeks before customers complain.

Are you monitoring percentiles or averages for your API latency?

### LinkedIn Post 2 (Tue Jul 14)

We cut MTTR from 45 minutes to 8 minutes with one change: putting context in alerts.

Before: "Alert: High latency on API." Engineer logs into Grafana. Checks 5 dashboards. Reads 3 log streams. 30 minutes of investigation before identifying the problem.

After: "Alert: p99 latency on /api/dashboard/metrics exceeded 2s for 5 minutes. Affected segment: enterprise tier. Trace: [link]. Top slow span: PostgreSQL query on metrics_aggregate table (1,200ms)."

The engineer clicks the trace link, sees the slow database query, checks the query plan, identifies the missing index, deploys the fix. 8 minutes total.

The difference: context in the alert, plus distributed tracing that follows the request across services.

Four things every alert should include:

1. Which metric, which percentile, which threshold
2. Which user segment is affected
3. A trace link to a representative slow request
4. What changed recently (deploy markers, config changes)

Most alerting systems can do this. Most teams don't configure it because the default is "metric crossed threshold, here's a number."

Do your alerts include enough context for the on-call engineer to skip the investigation phase?

### LinkedIn Post 3 (Wed Jul 15)

The average SaaS team has 50-200 active alerts. The on-call engineer ignores 90% of them because they're noise.

When a real problem fires, it's lost in the noise. This is how outages become customer-reported instead of engineer-detected.

The fix: error budget burn rate alerting.

Static thresholds ("alert when p99 exceeds 1 second") fire constantly. A temporary spike during a deploy, a 3 AM traffic dip that creates a percentage anomaly, a single slow request that skews the metric.

Error budgets flip the model. Define your SLO: 99.9% of requests under 1 second. That gives you an error budget of 0.1%, or 43.2 minutes of "bad" time per month.

Alert when the budget is being consumed too fast:

- Warning: budget consumed at 2x normal rate for 5 minutes
- Critical: budget consumed at 10x normal rate for 2 minutes

This automatically adjusts for traffic patterns. A 2-second spike during 1,000 RPS is significant. The same spike during 10 RPS at 3 AM is noise. Burn rate alerting distinguishes between the two.

How many of your current alerts are actionable versus noise?

### LinkedIn Post 4 (Thu Jul 16)

Synthetic monitoring tells you what the experience could be. Real User Monitoring tells you what the experience is.

A synthetic check from us-east-1 shows 150ms response time. Your customer in Mumbai on a 3G connection experiences 4,200ms.

RUM (Real User Monitoring) captures the actual experience by collecting metrics from real browsers on real devices over real networks.

The power is in segmentation. When p99 INP spikes to 800ms, filter by connection type: the problem only affects users on 3G networks. Filter by page: /dashboard/analytics has 3x worse LCP than every other page.

20 lines of code using the web-vitals library gives you this data. Segment by device, connection, geography, and page. You'll find performance problems that synthetic monitoring physically cannot detect.

The combination that works: synthetic monitoring for uptime and baseline, RUM for real user experience, distributed tracing for root cause analysis.

Do you know which specific user segments are having the worst performance experience in your application?

### X Tweet 1 (Tue Jul 14)

Your 200ms average response time hides 100 requests per minute that take 8 seconds. Those aren't random users—they're your enterprise customers on complex dashboards. Monitor p99, not averages.

### X Tweet 2 (Wed Jul 15)

We cut MTTR from 45 minutes to 8 minutes by putting context in alerts: which percentile, which user segment, a trace link to a slow request, and what deployed recently. The investigation phase disappeared.

### X Tweet 3 (Thu Jul 16)

50-200 active alerts and 90% are noise. Error budget burn rate alerting fixes this: define your SLO, alert when the budget burns too fast. Automatically ignores 3 AM noise, catches real degradation during peak traffic.

### Dev.to Article

**Title:** Real-Time Performance Monitoring That Actually Works
**Canonical URL:** https://alexmayhew.dev/blog/real-time-performance-monitoring

Your monitoring says the system is fine. Your customers say it's slow. The gap exists because you're measuring averages—and averages hide the pain.

**Why Averages Lie**

A 200ms average hides this distribution:

- p50: 120ms (fast)
- p90: 800ms (noticeable)
- p99: 8,000ms (broken)

The 1% hitting 8-second responses are often your highest-paying enterprise customers on complex dashboards.

**The Four Pillars**

1. **Percentile-Based Latency**: Track p50, p95, p99 per endpoint. Alert on p99 because that's where problems surface first. Use histograms (aggregatable across instances), not summaries.

2. **Real User Monitoring (RUM)**: Capture actual user experience with the web-vitals library. Segment by device, connection type, and page. Find problems synthetic monitoring can't detect.

3. **Error Budget Burn Rate**: Define SLOs, alert when the budget burns too fast. Automatically distinguishes between a 3 AM noise spike and real peak-traffic degradation. Eliminates 90% of alert noise.

4. **Distributed Tracing**: Follow a request across all services with OpenTelemetry. See that `processOrder` took 1,200ms—800ms in the payment API and 350ms in a missing-index database query.

**The Alert That Cuts MTTR**

Replace "Alert: High latency" with:

- Which metric, percentile, and threshold
- Which user segment is affected
- A trace link to a representative slow request
- What changed recently (deploys, config changes)

This single change cut one team's MTTR from 45 minutes to 8 minutes.

Read the full monitoring architecture with Prometheus alerting rules and Grafana dashboard configs: https://alexmayhew.dev/blog/real-time-performance-monitoring

### Newsletter Section

**This Week's Decision: How Should You Monitor Performance?**

**Situation:** Your SaaS has an average API response time of 200ms, but enterprise customers are complaining about slowness. Your monitoring dashboard shows green across the board.

**Insight:** Averages hide the pain. A 200ms average can coexist with a p99 of 8,000ms—meaning 1% of requests take 8 seconds, and those correlate with enterprise customers on complex queries. Switch to percentile-based monitoring (p50, p95, p99 per endpoint), add Real User Monitoring with device/network segmentation, and replace static threshold alerts with error budget burn rate alerting. Include trace links and user segment data in every alert so engineers skip the 30-minute investigation phase.

**When to Apply:** SaaS serving 1,000+ requests per minute that needs SLOs, or when customers report performance issues your monitoring doesn't catch.

**When NOT to Apply:** Small team with a monolith and fewer than 100 concurrent users—basic uptime monitoring and application logs are sufficient.
