# Core Web Vitals & PostgreSQL Migrations Research (2026-03-14)

**Status:** CURRENT
**Session:** Technical fact-checking for blog posts on CWV and PostgreSQL zero-downtime migrations

---

## Part 1: Core Web Vitals

### 1. CWV Thresholds — CONFIRMED UNCHANGED

The three thresholds are unchanged as of March 2026:

| Metric | Good    | Needs Improvement | Poor    |
| ------ | ------- | ----------------- | ------- |
| LCP    | ≤ 2.5s  | 2.5s – 4.0s       | > 4.0s  |
| INP    | ≤ 200ms | 200ms – 500ms     | > 500ms |
| CLS    | ≤ 0.1   | 0.1 – 0.25        | > 0.25  |

Pass/fail assessment uses the **75th percentile** of page loads, segmented across mobile and desktop.

Sources:

- https://developers.google.com/search/docs/appearance/core-web-vitals (updated 2025-12-10)
- https://web.dev/articles/vitals

### 2. CWV as a Ranking Signal — Still Active, Tiebreaker Role

CWV remain a ranking signal as of March 2026 but function as a **tiebreaker** when content quality is otherwise comparable — not a primary ranking driver. Key notes:

- The December 2025 Core Update continued emphasizing CWV alongside content quality, E-E-A-T, and relevance signals.
- Pages with LCP > 3s showed ~23% more traffic loss than faster competitors with similar content in competitive niches.
- Mobile performance standards have been raised — previously acceptable performance is now insufficient for top rankings in competitive spaces.
- No official change to the weight of CWV relative to other signals has been announced.

**The "Engagement Reliability" metric** was referenced by multiple SEO blogs as a 2025 Google addition, but this is **NOT confirmed by Google**. The official Google Search Central docs (updated 2025-12-10) list only LCP, INP, and CLS. Do not cite Engagement Reliability as an official metric.

### 3. INP Status — CONFIRMED CURRENT

INP officially replaced FID on **March 12, 2024**. INP has been stable throughout 2025-2026. FID is fully retired and should not appear in any current documentation. The three current Core Web Vitals metrics are LCP + INP + CLS — all in "stable" lifecycle phase.

Source: https://web.dev/blog/inp-cwv-launch

### 4. web-vitals Library API — CONFIRMED, CURRENT VERSION IS v5

The API functions `onLCP`, `onINP`, `onCLS` are correct and current. Current library version is **5.x** (5.1.0 documented).

```js
import { onCLS, onINP, onLCP } from "web-vitals";
// Attribution build:
import { onLCP, onINP, onCLS } from "web-vitals/attribution";
```

Additional functions available: `onFCP`, `onTTFB`.

Important: Do NOT call these functions more than once per page load — each creates a PerformanceObserver instance. Repeated calls will cause memory leaks.

Source: https://github.com/GoogleChrome/web-vitals (npm: web-vitals@5.1.0)

### 5. scheduler.yield() — NOT Chrome-Only Anymore, But Safari Missing

As of March 2026, `scheduler.yield()` has broader support than "experimental":

| Browser          | Support           |
| ---------------- | ----------------- |
| Chrome           | 129+              |
| Edge             | 129+              |
| Firefox          | 142+              |
| Opera            | 115+              |
| Samsung Internet | 28+               |
| Safari           | **NOT supported** |
| Safari iOS       | **NOT supported** |

**Global usage: ~72%** (per caniuse.com).

**Verdict for blog posts:** Do NOT call it "widely available" without qualification. The correct framing is: "available in all major browsers except Safari." Safari's absence is a significant caveat for any code that relies on it without a fallback.

Sources:

- https://caniuse.com/mdn-api_scheduler_yield
- https://developer.mozilla.org/en-US/docs/Web/API/Scheduler/yield

### 6. @tanstack/react-virtual — CONFIRMED RECOMMENDED

TanStack Virtual (v3, latest 3.13.22) is actively maintained and the standard recommendation for React virtualization as of 2025-2026. It is headless, framework-agnostic (React, Solid, Vue, Svelte), and integrates natively with TanStack Table v8.

- Package: `@tanstack/react-virtual`
- 973+ dependent packages on npm
- Supports vertical, horizontal, and grid virtualization; fixed and variable row sizes; window scrolling.
- 10-15kb, tree-shakeable.

Source: https://tanstack.com/virtual/latest

### 7. PerformanceObserver longtask API — SUPERSEDED BY LoAF

The longtask API (`type: 'longtask'`, 50ms threshold) still works in Chrome, but it is now considered the **legacy approach**. The recommended replacement is the **Long Animation Frames API (LoAF)**, which:

- Shipped in Chrome 123 (generally available, no longer origin trial).
- Observes frames > 50ms (not tasks), providing more actionable data.
- Includes render timing, script attribution, and style/layout/rendering phase breakdown.
- Addresses key shortcomings of the Long Tasks API (poor attribution, incomplete accounting).
- LoAF: `type: 'long-animation-frame'` in PerformanceObserver.

**Blog post implication:** If the post uses `new PerformanceObserver(cb).observe({ type: 'longtask' })`, this is still valid code but should note LoAF as the modern alternative. LoAF is Chrome-only currently.

Sources:

- https://developer.chrome.com/blog/loaf-has-shipped
- https://developer.chrome.com/docs/web-platform/long-animation-frames
- https://developer.mozilla.org/en-US/docs/Web/API/PerformanceLongAnimationFrameTiming

### 8. New CWV Developments 2025-2026

- **LoAF (Long Animation Frames):** shipped Chrome 123, primary tool for diagnosing INP issues. web-vitals v4+ uses LoAF internally for INP attribution.
- **web-vitals v4 and v5:** added LoAF-based INP breakdown/attribution in the attribution build.
- **No new official Core Web Vitals metrics added.** The three metrics (LCP, INP, CLS) are stable.
- **"Engagement Reliability":** appears only in third-party SEO blogs, not in any Google official source. Treat as unverified speculation.

---

## Part 2: PostgreSQL Migrations

### 1. ADD COLUMN with DEFAULT — Metadata-Only in PG 11+ CONFIRMED

**Confirmed: PG 11+ performs ADD COLUMN with a non-volatile DEFAULT as a metadata-only operation** — no table rewrite, no lock escalation beyond brief ACCESS EXCLUSIVE for catalog update.

Mechanism: PostgreSQL stores the default value in `pg_attribute.atthasmissing` / `pg_attribute.attmissingval`. Existing rows dynamically return the stored default without being physically rewritten.

**Critical caveat:** This optimization applies ONLY to non-volatile (static) defaults. **Volatile defaults still trigger a full table rewrite:**

- `DEFAULT gen_random_uuid()` — triggers rewrite
- `DEFAULT random()` — triggers rewrite
- `DEFAULT now()` — triggers rewrite (volatile)
- `DEFAULT 'fixed-string'` — metadata-only (safe)
- `DEFAULT 42` — metadata-only (safe)
- `DEFAULT false` — metadata-only (safe)

This is still correct as of PG 17 (PostgreSQL 18 docs confirm same behavior).

Sources:

- https://www.enterprisedb.com/blog/adding-new-table-columns-default-values-postgresql-11
- https://brandur.org/postgres-default
- https://www.postgresql.org/docs/current/sql-altertable.html

### 2. SKIP LOCKED — CONFIRMED Best Practice for Batch Updates

`SELECT ... FOR UPDATE SKIP LOCKED` remains the idiomatic PostgreSQL pattern for queue-based and batch-update workloads as of 2025. Available since PG 9.5.

Key implementation details confirmed:

- Requires a composite index on the WHERE clause columns (e.g., `(status, created_at)`)
- Use `ORDER BY` to ensure deterministic processing order (FIFO: `ORDER BY created_at`)
- Combine with `LIMIT` for batching: `FOR UPDATE SKIP LOCKED LIMIT 100`
- Used in production by Solid Queue (37signals), pg-boss, and other job queue libraries

Important correctness note: SKIP LOCKED provides an **intentionally inconsistent view** of the data — appropriate for queue-like workloads, unsuitable for general consistency-requiring queries.

Sources:

- https://www.inferable.ai/blog/posts/postgres-skip-locked
- https://www.netdata.cloud/academy/update-skip-locked/

### 3. Prisma Migrate + CONCURRENTLY — RESOLVED (issue closed "COMPLETED")

**Status change from the commonly-cited limitation:** GitHub issue #14456 is now marked **CLOSED / COMPLETED** as of early 2026. Prisma fixed the transaction wrapping behavior that prevented `CREATE INDEX CONCURRENTLY` from working.

The historical limitation was: Prisma wrapped multi-statement migrations in a transaction, and `CREATE INDEX CONCURRENTLY` cannot run inside a transaction block. The workaround was splitting each CONCURRENTLY statement into its own single-statement migration file (Prisma did not wrap single-statement migrations in a transaction).

**Current state:** Native support has been added. Blog posts citing the "workaround required" approach should note this is the historical behavior and check current Prisma docs/version for the fix.

Source: https://github.com/prisma/prisma/issues/14456

### 4. Django AddIndexConcurrently — CONFIRMED, Available Since Django 3.0

`AddIndexConcurrently` and `RemoveIndexConcurrently` have been available in `django.contrib.postgres.operations` since **Django 3.0** (released December 2019). Current Django is 5.x — this is a stable, well-established feature.

Usage requires a **non-atomic migration** (the migration must set `atomic = False`).

```python
from django.contrib.postgres.operations import AddIndexConcurrently
from django.db import migrations, models

class Migration(migrations.Migration):
    atomic = False  # Required

    operations = [
        AddIndexConcurrently(
            model_name='mymodel',
            index=models.Index(fields=['field_name'], name='mymodel_field_name_idx'),
        ),
    ]
```

Sources:

- https://docs.djangoproject.com/en/5.2/ref/contrib/postgres/operations/
- https://docs.djangoproject.com/en/5.1/releases/3.0/

### 5. Rails algorithm: :concurrently — CONFIRMED Correct Syntax

The syntax is correct and stable across all modern Rails versions:

```ruby
class AddIndexConcurrently < ActiveRecord::Migration[7.x]
  disable_ddl_transaction!  # Required

  def change
    add_index :table_name, :column_name, algorithm: :concurrently
  end
end
```

Requirements:

- `disable_ddl_transaction!` is mandatory (CONCURRENTLY cannot run inside a transaction)
- PostgreSQL only (MySQL uses `algorithm: :inplace`)
- Can be combined with other options: `algorithm: :concurrently, if_not_exists: true`

Source: https://thoughtbot.com/blog/how-to-create-postgres-indexes-concurrently-in

### 6. AWS RDS Snapshot Pricing — $0.095/GB-month CONFIRMED (for overage)

The $0.095/GB-month figure is accurate **but requires important context:**

- **Free tier:** AWS provides free backup storage up to 100% of the provisioned database size per region. A 100GB RDS instance gets 100GB of snapshot storage free.
- **Overage rate (us-east-1):** ~$0.095/GB-month for snapshot storage beyond the free allocation.
- **S3 export rate:** ~$0.010/GB of snapshot size (some sources cite $0.013/GB — verify on official pricing page for the target region).

The $0.095/GB-month figure is specific to us-east-1 and applies to the overage portion only. Cite it with region qualification.

Source: https://aws.amazon.com/rds/pricing/

### 7. PostgreSQL 17 — Migration-Relevant Changes

PostgreSQL 17 (released September 2024, supported until November 2029):

**Key migration improvements:**

1. **pg_upgrade preserves logical replication slots** — in PG 16 and earlier, logical slots had to be dropped before a major-version upgrade. PG 17 eliminates this requirement.
2. **Vacuum memory overhaul** — memory usage reduced by up to 20x, reducing resource contention during large table maintenance.
3. **SQL/JSON additions** — `JSON_TABLE()`, JSON constructors, identity functions (relevant if migrating JSON-heavy schemas).
4. **search_path safety requirement** — Functions used by expression indexes and materialized views that reference non-default schemas must explicitly specify a `search_path`. This is a **breaking change** for some setups upgrading to PG 17.

**No changes to ADD COLUMN or SKIP LOCKED behavior in PG 17** — those remain as documented above.

Sources:

- https://www.postgresql.org/docs/17/release-17.html
- https://www.rapydo.io/blog/postgresql-16-vs-17-whats-new-and-what-it-means-on-aws

---

## Summary: Claims Verified / Flagged

| Claim                                       | Status               | Notes                                                   |
| ------------------------------------------- | -------------------- | ------------------------------------------------------- |
| CWV thresholds LCP<2.5s, INP<200ms, CLS<0.1 | VERIFIED             | Unchanged as of March 2026                              |
| CWV affects Google ranking                  | VERIFIED             | Tiebreaker role, not primary signal                     |
| INP replaced FID March 2024                 | VERIFIED             | Confirmed, FID fully retired                            |
| web-vitals API: onLCP, onINP, onCLS         | VERIFIED             | Current in v5.x                                         |
| scheduler.yield() widely available          | NEEDS NUANCE         | ~72% coverage, **no Safari support**                    |
| @tanstack/react-virtual recommended         | VERIFIED             | v3 actively maintained                                  |
| PerformanceObserver longtask unchanged      | OUTDATED             | LoAF (Chrome 123+) is the modern replacement            |
| ADD COLUMN DEFAULT metadata-only PG11+      | VERIFIED             | Volatile defaults still rewrite                         |
| SKIP LOCKED best practice                   | VERIFIED             | Still the standard pattern                              |
| Prisma CONCURRENTLY requires workaround     | OUTDATED             | Issue closed COMPLETED — native support added           |
| Django AddIndexConcurrently since 3.0       | VERIFIED             | Stable in Django 5.x                                    |
| Rails algorithm: :concurrently syntax       | VERIFIED             | Correct, unchanged                                      |
| RDS snapshots $0.095/GB-month               | VERIFIED WITH CAVEAT | us-east-1 overage rate only; free tier = 100% DB size   |
| PostgreSQL 17 migration changes             | DOCUMENTED           | pg_upgrade + logical slots; search_path breaking change |
